import _ = require("lodash");
import { Group, Object3D, Material, AnimationMixer, Vector3, Mesh, BoxGeometry, MeshLambertMaterial, AnimationClip, MathUtils, Quaternion, Matrix4 } from "three";
import { KeyBinding } from "../core/key-binding";
import { World } from "../entities/world";
import { CollisionGroups } from "../enums/collision-groups";
import { ICharacterAI } from "../interfaces/ICharacterAI";
import { ICharacterState } from "../interfaces/ICharacterState";
import { EntityType, IWorldEntity } from "../interfaces/IWorldEntity";
import { CapsuleCollider } from "../physics/colliders/capsule-collider";
import { RelativeSpringSimulator } from "../physics/spring-simulation/relative-spring-simulator";
import { VectorSpringSimulator } from "../physics/spring-simulation/vector-spring-simulator";
import { applyVectorMatrixXZ, cannonVector, getForward, getSignedAngleBetweenVectors, haveDifferentSigns, setupMeshProperties, threeVector } from "../utils/function-library";
import { GroundImpactData } from "./ground-impact-data";
import * as CANNON from 'cannon'
import { Idle } from "./character-states";

export class Character extends Object3D implements IWorldEntity {
  public entityType = EntityType.Character
  public updateOrder = 1

  public height = 0
  public tiltContainer: Group
  public modelContainer: Group
  public materials: Material[] = []
  public mixer: AnimationMixer

  public animations: any[]

  // Movement
  public acceleration = new Vector3()
  public velocity = new Vector3()
  public arcadeVelocityInfluence = new Vector3()
  public velocityTarget = new Vector3()
  public arcadeVelocityIsAdditive = false

  public defaultVelocitySimulatorDamping = 0.8
  public defaultVelocitySimulatorMass = 50
  public velocitySimulator: VectorSpringSimulator
  public moveSpeed = 4
  public angularVelocity = 0
  public orientation = new Vector3(0, 0, 1)
  public orientationTarget = new Vector3(0, 0, 1)
  public defaultRotationSimulatorDamping = 0.5
  public defaultRotationSimulatorMass = 10
  public rotationSimulator: RelativeSpringSimulator
  public viewVector: Vector3

  public actions: { [actionName: string]: KeyBinding }

  public characterCapsule: CapsuleCollider

  // Ray Casting
  public rayResult = new CANNON.RaycastResult()
  public rayWasHit = false
  public rayCastLength = 0.57
  public raySafeOffset = 0.03

  public wantsToJump = false
  public initJumpSpeed = -1
  public groundImpactData = new GroundImpactData()
  public raycastBox: Mesh

  public world: World
  public charState: ICharacterState
  public behavior: ICharacterAI

  private physicsEnabled = true

  constructor(gltf: any) {
    super()

    this.readCharacterData(gltf)
    this.setAnimations(gltf.animations)

    // The visuals group is centered for easy character tilting
    this.tiltContainer = new Group()
    this.add(this.tiltContainer)

    // Model container is used to reliably ground the character, as animation can alter the position of the model itself 
    this.modelContainer = new Group()
    this.modelContainer.position.y = -0.57
    this.tiltContainer.add(this.modelContainer)
    this.modelContainer.add(gltf.scene)

    this.mixer = new AnimationMixer(gltf.scene)

    this.velocitySimulator = new VectorSpringSimulator(60, this.defaultVelocitySimulatorMass, this.defaultVelocitySimulatorDamping)
    this.rotationSimulator = new RelativeSpringSimulator(60, this.defaultRotationSimulatorMass, this.defaultRotationSimulatorDamping)

    this.viewVector = new Vector3()

    // Actions
    this.actions = {
      'up': new KeyBinding('KeyW'),
      'down': new KeyBinding('KeyS'),
      'left': new KeyBinding('KeyA'),
      'right': new KeyBinding('KeyD'),
      'run': new KeyBinding('ShiftLeft'),
      'jump': new KeyBinding('Space'),
      'use': new KeyBinding('KeyE'),
      'primary': new KeyBinding('Mouse0'),
      'secondary': new KeyBinding('Mouse1'),
    }

    // Physics

    // Player Capsule
    this.characterCapsule = new CapsuleCollider({
      mass: 1,
      position: new CANNON.Vec3(),
      height: 0.5,
      radius: 0.25,
      segments: 8,
      friction: 0
    })

    this.characterCapsule.body.shapes.forEach((shape) => {
      shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders
    })

    this.characterCapsule.body.allowSleep = false

    // Move character to different collision group for raycasting
    this.characterCapsule.body.collisionFilterGroup = 2

    // Disable character rotation
    this.characterCapsule.body.fixedRotation = true
    this.characterCapsule.body.updateMassProperties()

    // Raycast debug
    const boxGeo = new BoxGeometry(0.1, 0.1, 0.1)
    const boxMat = new MeshLambertMaterial({ color: 0xff0000 })
    this.raycastBox = new Mesh(boxGeo, boxMat)
    this.raycastBox.visible = false

    // Physics pre / post step callback bindings
    this.characterCapsule.body.preStep = (body: CANNON.Body) => {
      this.physicsPreStep(body, this)
    }
    this.characterCapsule.body.postStep = (body: CANNON.Body) => {
      this.physicsPostStep(body, this)
    }

    // States
    this.setState(new Idle(this))
  }
  
  setAnimations = (animations: []): void => {
    this.animations = animations
  }

  setArcadeVelocityInfluence = (x: number, y: number = x, z: number = x): void => {
    this.arcadeVelocityInfluence.set(x, y, z)
  }

  setViewVector = (vector: Vector3): void => {
    this.viewVector.copy(vector).normalize()
  }

  setState = (state: ICharacterState) => {
    this.charState = state

    this.charState.onInputChange()
  }

  setPosition = (x: number, y: number, z: number): void => {
    if (this.physicsEnabled) {
      this.characterCapsule.body.previousPosition = new CANNON.Vec3(x, y, z)
      this.characterCapsule.body.position = new CANNON.Vec3(x, y, z)
      this.characterCapsule.body.interpolatedPosition = new CANNON.Vec3(x, y, z)
    } else {
      this.position.x = x
      this.position.y = y
      this.position.z = z
    }
  }

  resetVelocity = (): void => {
    this.velocity.x = 0
    this.velocity.y = 0
    this.velocity.z = 0

    this.characterCapsule.body.velocity.x = 0
    this.characterCapsule.body.velocity.y = 0
    this.characterCapsule.body.velocity.z = 0

    this.velocitySimulator.init()
  }

  setArcadeVelocityTarget = (velZ: number, velX: number = 0, velY: number = 0): void => {
    this.velocityTarget.z = velZ
    this.velocityTarget.x = velX
    this.velocityTarget.y = velY
  } 

  setOrientation = (vector: Vector3, instantly = false): void => {
    let lookVector = new Vector3().copy(vector).setY(0).normalize()
    this.orientationTarget.copy(lookVector)

    if (instantly) {
      this.orientation.copy(lookVector)
    }
  }

  resetOrientation = (): void => {
    const forward = getForward(this)
    this.setOrientation(forward, true)
  }

  setBehaviour = (behaviour: ICharacterAI): void => {
    behaviour.character = this
    this.behavior = behaviour
  }

  setPhysicsEnabled = (value: boolean): void => {
    this.physicsEnabled = value

    if (value === true) {
      this.world.physicsWorld.addBody(this.characterCapsule.body)
    } else {
      this.world.physicsWorld.remove(this.characterCapsule.body)
    }
  }

  readCharacterData = (gltf: any): void => {
    gltf.scene.traverse((child => {
      if (child.isMesh) {
        setupMeshProperties(child)

        if (child.material !== undefined) {
          this.materials.push(child.material)
        }
      }
    }))
  }

  handleKeyboardEvent = (event: KeyboardEvent, code: string, pressed: boolean): void => {
    // if (this.controlledObject !== undefined) {
    //   this.controlledObject.handleKeyboardEvent(event, code, pressed)
    // }

    // console.log('code: ', code)

    // // Free camera
    // if (code === 'KeyC' && pressed === true && event.shiftKey === true) {
    //   this.resetControls()

    //   this.world.cameraOperator.characterCaller = this
    //   this.world.inputManager.setInputReceiver(this.world.cameraOperator)
    // } else if (code === 'KeyR' && pressed === true && event.shiftKey === true) {
    //   // this.world.restartScenario()
    //   return
    // }

    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        const binding = this.actions[action]

        if (_.includes(binding.eventCodes, code)) {
          this.triggerAction(action, pressed)
        }
      }
    }
  }

  handleMouseButton = (event: MouseEvent, code: string, pressed: boolean): void => {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        const binding = this.actions[action]

        if (_.includes(binding.eventCodes, code)) {
          this.triggerAction(action, pressed)
        }
      }
    }
  }

  handleMouseMove = (event: MouseEvent, deltaX: number, deltaY: number): void => {
    this.world.cameraOperator.move(deltaX, deltaY)
  }

  handleMouseWheel = (event: WheelEvent, value: number): void => {
    // this.world.scrollTheTimeScale(value)
  }

  triggerAction = (actionName: string, value: boolean) => {
    let action = this.actions[actionName]

    if (action.isPressed !== value) {
      // Set Value
      action.isPressed = value

      // Reset the just attributes
      action.justPressed = false
      action.justReleased = false

      if (value) {
        action.justPressed = true
      } else {
        action.justReleased = true
      }


      // Tell player to handle states according to new input
      this.charState.onInputChange()

      // Reset the just attributes
      action.justPressed = false
      action.justReleased = false
    }
  }

  takeControl = (): void => {
    if (this.world !== undefined) {
      this.world.inputManager.setInputReceiver(this)
    } else {
      console.warn('Attempting to take control of a character that does not belong to a world')
    }
  }

  resetControls = (): void => {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        this.triggerAction(action, false)
      }
    }
  }

  public update(timeStep: number): void {
    this.behavior?.update(timeStep)

    this.charState?.update(timeStep)

    if (this.physicsEnabled) {
      this.springMovement(timeStep)
      this.springRotation(timeStep)
      this.rotateModel()
    }

    if (this.mixer !== undefined) {
      this.mixer.update(timeStep)
    }
    
    if (this.physicsEnabled) {
      this.position.set(
        this.characterCapsule.body.interpolatedPosition.x,
        this.characterCapsule.body.interpolatedPosition.y,
        this.characterCapsule.body.interpolatedPosition.z,
      )
    } else {
      let newPos = new Vector3()
      this.getWorldPosition(newPos)

      this.characterCapsule.body.position.copy(cannonVector(newPos))
      this.characterCapsule.body.interpolatedPosition.copy(cannonVector(newPos))
    }

    this.updateMatrixWorld()
  }

  inputReceiverInit = (): void => {
    this.world.cameraOperator.setRadius(1.6, true)
    this.world.cameraOperator.followMode = false
  }

  inputReceiverUpdate = (timeStep: number): void => {
    this.viewVector = new Vector3().subVectors(this.position, this.world.camera.position)
    this.getWorldPosition(this.world.cameraOperator.target)
  }

  setAnimation = (clipName: string, fadeIn: number): number => {
    if (this.mixer !== undefined) {
      // GLTF
      let clip = AnimationClip.findByName(this.animations, clipName)

      let action = this.mixer.clipAction(clip)
      if (action === null) {
        return 0
      }

      this.mixer.stopAllAction()
      action.fadeIn(fadeIn)
      action.play()

      return action.getClip().duration
    }
  }

  springMovement = (timeStep: number): void => {
    // Simulator
    this.velocitySimulator.target.copy(this.velocityTarget)
    this.velocitySimulator.simulate(timeStep)
    // Update 
    this.velocity.copy(this.velocitySimulator.position)
    this.acceleration.copy(this.velocitySimulator.velocity)
  }

  springRotation = (timeStep: number): void => {
    let angle = getSignedAngleBetweenVectors(this.orientation, this.orientationTarget)

    this.rotationSimulator.target = angle
    this.rotationSimulator.simulate(timeStep)
    
    let rot = this.rotationSimulator.position

    this.orientation.applyAxisAngle(new Vector3(0, 1, 0), rot)
    this.angularVelocity = this.rotationSimulator.velocity
  }

  getLocalMovementDirection = (): Vector3 => {
    const positiveX = this.actions.right.isPressed ? -1 : 0
    const negativeX = this.actions.left.isPressed ? 1 : 0
    const positiveZ = this.actions.up.isPressed ? 1 : 0
    const negativeZ = this.actions.down.isPressed ? -1 : 0

    return new Vector3(
      positiveX + negativeX,
      0,
      positiveZ + negativeZ
    ).normalize()
  }

  getCameraRelativeMovementVector = (): Vector3 => {
    const localDirection = this.getLocalMovementDirection()

    const flatViewVector = new Vector3(this.viewVector.x, 0, this.viewVector.z).normalize()

    return applyVectorMatrixXZ(flatViewVector, localDirection)
  }

  setCameraRelativeOrientationTarget = (): void => {
    let moveVector = this.getCameraRelativeMovementVector()

    if (moveVector.x === 0 && moveVector.y === 0 && moveVector.z === 0) {
      this.setOrientation(this.orientation)
    } else {
      this.setOrientation(moveVector)
    }
  }

  rotateModel = (): void => {
    this.lookAt(this.position.x + this.orientation.x, this.position.y + this.orientation.y, this.position.z + this.orientation.z)

    this.tiltContainer.rotation.z = (-this.angularVelocity * 2.3 * this.velocity.length())

    this.tiltContainer.position.setY((Math.cos(Math.abs(this.angularVelocity * 2.3 * this.velocity.length())) / 2) - 0.5) 
  }

  jump = (initJumpSpeed = -1): void => {
    this.wantsToJump = true
    this.initJumpSpeed = initJumpSpeed
  }

  physicsPreStep = (body: CANNON.Body, character: Character): void => {
    character.feetRaycast()

    // Raycast debug
    if (character.rayWasHit) {
      if (character.raycastBox.visible) {
        character.raycastBox.position.x = character.rayResult.hitPointWorld.x
        character.raycastBox.position.y = character.rayResult.hitPointWorld.y
        character.raycastBox.position.z = character.rayResult.hitPointWorld.z
      }
    } else {
      if (character.raycastBox.visible) {
        character.raycastBox.position.set(body.position.x, body.position.y - character.rayCastLength - character.raySafeOffset, body.position.z)
      }
    }
  }

  feetRaycast = (): void => {
    // Player ray casting

    // Create ray cast
    let body = this.characterCapsule.body

    const start = new CANNON.Vec3(body.position.x, body.position.y, body.position.z)
    const end = new CANNON.Vec3(body.position.x, body.position.y - this.rayCastLength - this.raySafeOffset, body.position.z)

    // Raycast options
    const rayCastOptions = {
      collisionFilterMask: CollisionGroups.Default,
      skipBackfaces: true,
    }

    // Cast the ray
    this.rayWasHit = this.world.physicsWorld.raycastClosest(start, end, rayCastOptions, this.rayResult)
  }

  physicsPostStep = (body: CANNON.Body, character: Character): void => {
    // Get velocities
    let simulatedVelocity = new Vector3(body.velocity.x, body.velocity.y, body.velocity.z)

    // Take local velocity
    let arcadeVelocity = new Vector3().copy(character.velocity).multiplyScalar(character.moveSpeed)
      // Turn local into global
    arcadeVelocity = applyVectorMatrixXZ(character.orientation, arcadeVelocity)

    let newVelocity = new Vector3()

    if (character.arcadeVelocityIsAdditive) {
      newVelocity.copy(simulatedVelocity)

      let globalVelocityTarget = applyVectorMatrixXZ(character.orientation, character.velocityTarget)
      let add = new Vector3().copy(arcadeVelocity).multiply(character.arcadeVelocityInfluence)

      if (Math.abs(simulatedVelocity.x) < Math.abs(globalVelocityTarget.x * character.moveSpeed) || haveDifferentSigns(simulatedVelocity.x, arcadeVelocity.x)) {
        newVelocity.x += add.x
      }

      if (Math.abs(simulatedVelocity.y) < Math.abs(globalVelocityTarget.y * character.moveSpeed) || haveDifferentSigns(simulatedVelocity.y, arcadeVelocity.y)) {
        newVelocity.y += add.y
      }

      if (Math.abs(simulatedVelocity.z) < Math.abs(globalVelocityTarget.z * character.moveSpeed) || haveDifferentSigns(simulatedVelocity.z, arcadeVelocity.z)) {
        newVelocity.z += add.z
      }
    } else {
      newVelocity = new Vector3(
        MathUtils.lerp(simulatedVelocity.x, arcadeVelocity.x, character.arcadeVelocityInfluence.x),
        MathUtils.lerp(simulatedVelocity.y, arcadeVelocity.y, character.arcadeVelocityInfluence.y),
        MathUtils.lerp(simulatedVelocity.z, arcadeVelocity.z, character.arcadeVelocityInfluence.z),
      )
    }

    // If we're hitting the ground, stick to ground
    if (character.rayWasHit) {
      // Flatten velocity
      newVelocity.y = character.rayResult.hitPointWorld.y

      // Move on top of moving objects
      if (character.rayResult.body.mass > 0) {
        let pointVelocity = new CANNON.Vec3()

        character.rayResult.body.getVelocityAtWorldPoint(character.rayResult.hitPointWorld, pointVelocity)

        newVelocity.add(threeVector(pointVelocity))
      }

			// Measure the normal vector offset from direct "up" vector
			// and transform it into a matrix
			let up = new Vector3(0, 1, 0);
			let normal = new Vector3(character.rayResult.hitNormalWorld.x, character.rayResult.hitNormalWorld.y, character.rayResult.hitNormalWorld.z);
			let q = new Quaternion().setFromUnitVectors(up, normal);
			let m = new Matrix4().makeRotationFromQuaternion(q);

      // Rotate the velocity vector
      newVelocity.applyMatrix4(m)
		
      // Apply velocity
      body.velocity.x = newVelocity.x
      body.velocity.y = newVelocity.y
      body.velocity.z = newVelocity.z

      // Ground character
      body.position.y = character.rayResult.hitPointWorld.y + character.rayCastLength + (newVelocity.y / character.world.physicsFrameRate)
    } else {
      // If we're in air
      body.velocity.x = newVelocity.x
      body.velocity.y = newVelocity.y
      body.velocity.z = newVelocity.z

      // Save last in-air information
      character.groundImpactData.velocity.x = body.velocity.x
      character.groundImpactData.velocity.y = body.velocity.y
      character.groundImpactData.velocity.z = body.velocity.z
    }

    // Jumping
    if (character.wantsToJump) {
      // If initJumpSpeed is set
      if (character.initJumpSpeed > -1) {
        // Flatten velocity
        body.velocity.y = 0

        let speed = Math.max(
          character.velocitySimulator.position.length() * 4,
          character.initJumpSpeed
        )

        body.velocity = cannonVector(character.orientation.clone().multiplyScalar(speed))
      } else {
        // Moving objects compensation
        let add = new CANNON.Vec3()
        character.rayResult.body.getVelocityAtWorldPoint(character.rayResult.hitPointWorld, add)
        body.velocity.vsub(add, body.velocity)
      }

      // Add positive vertical velocity
      body.velocity.y += 4
      // Move above ground by 2x safe offset value
      body.position.y += character.raySafeOffset * 2
      // Reset flag
      character.wantsToJump = false
    }
  }

  addToWorld = (world: World): void => {
    if (_.includes(world.characters, this)) {
      console.warn('Adding character to a world in which it already exists')
      return
    }

    // Set world
    this.world = world

    // Register character
    world.characters.push(this)

    // Register physics
    world.physicsWorld.addBody(this.characterCapsule.body)

    // Add to graphics world
    world.graphicsWorld.add(this)
    world.graphicsWorld.add(this.raycastBox)

    // Shadow cascades

    this.materials.forEach(mat => {
      world.sky.csm.setupMaterial(mat)
    })
  }

  removeFromWorld = (world: World): void => {
    if (_.includes(world.characters, this)) {
      console.warn('Removing character to a world in which it isn\'t present')
      return
    }

    if (world.inputManager.inputReceiver === this) {
      world.inputManager.inputReceiver = undefined
    }

    this.world = undefined

    // Remove from characters
    _.pull(world.characters, this)

    // Remove physics
    world.physicsWorld.remove(this.characterCapsule.body)

    // Add to graphics world
    world.graphicsWorld.remove(this)
    world.graphicsWorld.remove(this.raycastBox)
  }
}
