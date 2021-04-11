import _ = require("lodash");
import { Camera, MathUtils, Vector2, Vector3 } from "three";
import { World } from "../entities/world";
import { IInputAction, IInputReceiver } from "../interfaces/IInputReceiver";
import { IUpdatable } from "../interfaces/IUpdatable";
import { getBack, getRight, getUp } from "../utils/function-library";
import { KeyBinding } from "./key-binding";

export class CameraOperator implements IInputReceiver, IUpdatable {

  public updateOrder = 4

  public world: World
  public camera: Camera
  public target: Vector3
  public sensitivity: Vector2
  public radius = 1
  public theta: number
  public phi: number
  public onMouseDownPosition: Vector2
  public onMouseDownTheta: any;
  public onMouseDownPhi: any;
  public targetRadius = 1

  public movementSpeed: number
  public actions: IInputAction

  public upVelocity = 0
  public forwardVelocity = 0
  public rightVelocity = 0

  public followMode = false

  // public characterCaller: Character

  constructor(world: World, camera: Camera, sensitivityX: number = 1, sensitivityY: number = sensitivityX * 0.8) {
    this.world = world
    this.camera = camera
    this.target = new Vector3()
    this.sensitivity = new Vector2(sensitivityX, sensitivityY)
    this.movementSpeed = 0.06
    this.radius = 3
    this.theta = 0
    this.phi = 0

    this.onMouseDownPosition = new Vector2()
    this.onMouseDownTheta = this.theta
    this.onMouseDownPhi = this.phi

    this.actions = {
      forward: new KeyBinding('KeyW'),
      back: new KeyBinding('KeyS'),
      left: new KeyBinding('KeyA'),
      right: new KeyBinding('KeyD'),
      up: new KeyBinding('KeyE'),
      down: new KeyBinding('KeyQ'),
      fast: new KeyBinding('ShiftLeft'),
    }

    world.registerUpdatable(this)
  }

  setSensitivity = (sensitivityX: number, sensitivityY: number = sensitivityX) => {
    this.sensitivity = new Vector2(sensitivityX, sensitivityY)
  }

  setRadius = (value: number, instantly: boolean = false)  => {
    this.targetRadius = Math.max(0.001, value)

    if (instantly) {
      this.radius = value
    }
  }

  move = (deltaX: number, deltaY: number) => {
    this.theta -= deltaX * (this.sensitivity.x / 2)
    this.theta %= 360

    this.phi += deltaY * (this.sensitivity.y / 2)
    this.phi = Math.min(85, Math.max(-85, this.phi))
  }

  update = (timeScale: number) => {
    if (this.followMode) {
      this.camera.position.y = MathUtils.clamp(
        this.camera.position.y, this.target.y, Number.POSITIVE_INFINITY
      )

      this.camera.lookAt(this.target)

      let newPos = this.target.clone().add(
        new Vector3().subVectors(this.camera.position, this.target).normalize().multiplyScalar(this.targetRadius)
      )

      this.camera.position.x = newPos.x
      this.camera.position.y = newPos.y
      this.camera.position.z = newPos.z

      return
    }

    this.radius = MathUtils.lerp(this.radius, this.targetRadius, 0.1)
    
    this.camera.position.x = this.target.x + this.radius * Math.sin(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180)
    this.camera.position.y = this.target.y + this.radius * Math.sin(this.phi * Math.PI / 180)
    this.camera.position.z = this.target.z + this.radius * Math.cos(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180)
    this.camera.updateMatrix()
    this.camera.lookAt(this.target)
  }

  handleKeyboardEvent = (event: KeyboardEvent, code: string, pressed: boolean) => {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        const binding = this.actions[action]

        if (_.includes(binding.eventCodes, code)) {
          binding.isPressed = pressed
        }
      }
    }
  }

  handleMouseWheel = (event: WheelEvent, value: number) => {
  }

  handleMouseMove = (event: MouseEvent, deltaX: number, deltaY: number) => {
    this.move(deltaX, deltaY)
  }

  handleMouseButton = (event: MouseEvent, code: string, pressed: boolean) => {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        const binding = this.actions[action]

        if (_.includes(binding.eventCodes, code)) {
          binding.isPressed = pressed
        }
      }
    }
  }

  inputReceiverInit = () => {
    this.target.copy(this.camera.position)

    this.setRadius(0, true)
  }

  inputReceiverUpdate = (timestep: number) => {
    let speed = this.movementSpeed * (timestep * (this.actions.fast.isPressed ? 600 : 60))
  
    const up = getUp(this.camera)
    const right = getRight(this.camera)
    const forward = getBack(this.camera)

    this.upVelocity = MathUtils.lerp(this.upVelocity, +this.actions.up.isPressed - +this.actions.down.isPressed, 0.3)
    this.forwardVelocity = MathUtils.lerp(this.forwardVelocity, +this.actions.forward.isPressed - +this.actions.back.isPressed, 0.3)
    this.rightVelocity = MathUtils.lerp(this.rightVelocity, +this.actions.right.isPressed - +this.actions.left.isPressed, 0.3)
  
    this.target.add(up.multiplyScalar(speed * this.upVelocity))
    this.target.add(forward.multiplyScalar(speed * this.forwardVelocity))
    this.target.add(right.multiplyScalar(speed * this.rightVelocity))
  }
}
