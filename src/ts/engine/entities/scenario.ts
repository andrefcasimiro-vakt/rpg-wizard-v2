import { IMap } from "../../editor/interfaces/IMap"
import { IMapEvent } from "../../editor/interfaces/IMapEvent"
import { IMapGround } from "../../editor/interfaces/IMapGround"
import {  BoxGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Vector3 } from "three"
import { LoadingManager } from "../core/loading-manager"
import { UIManager } from "../core/ui-manager"
import { World } from "./world"
import { BoxCollider } from "../physics/colliders/box-collider"
import { cannonQuaternion, cannonVector } from "../utils/function-library"
import { CollisionGroups } from "../enums/collision-groups"
import { Event } from "../event-system/event"
import { MapStorage } from "src/ts/storage"
import { RepeatWrapping } from "three"
import { IMapProp } from "src/ts/editor/interfaces/IMapProp"
import { EntityLoader } from "src/ts/engine/core/entity-loader"

var groundMesh = new Mesh(new BoxGeometry(1, 1, 1))
groundMesh.castShadow = true
groundMesh.receiveShadow = true

export class Scenario {
  public mapUuid: string
  public map: IMap

  public spawnAlways = false
  public default = false

  public world: World
  public spawnPoint: Vector3

  public loadingManager: LoadingManager;

  public entityLoader: EntityLoader;

  public scene: Object3D

  constructor(world: World, mapUuid: string) {
    this.world = world
    this.mapUuid = mapUuid

    this.map = MapStorage.getCurrentMap()

    this.loadingManager = new LoadingManager(world)
    this.entityLoader = new EntityLoader(this.loadingManager, this.map)

    this.launch(this.world)
  }

  launch = (world: World): void => {
    document.exitPointerLock();

    world.clearEntities()

    world.cameraOperator.theta = 1
    world.cameraOperator.phi = 15

    UIManager.setLoadingScreenVisible(true)

    this.loadingManager.onFinishedCallback = () => {
      this.world.update(1, 1)
      this.world.setTimeScale(1)

      this.world.inputManager.setPointerLock(true)
      UIManager.setLoadingScreenVisible(false)

      console.log(this.entityLoader)
      this.drawMap()
    }
  }

  drawMap = (): void => {
    this.scene = new Object3D()

    const currentMap = this.map
    const currentMapGrounds = currentMap?.grounds || []
    const currentMapEvents = currentMap?.events || []
    const currentMapProps = currentMap?.props || []

    currentMapGrounds.forEach(this.handleGround)
    currentMapEvents.forEach(this.handleEvent)
    currentMapProps.forEach(this.handleProp)

    this.world.graphicsWorld.add(this.scene)

    this.world.initSky()
  }

  handleGround = (currentMapGround: IMapGround) => {
    var entry: Mesh;
    entry = groundMesh.clone()

    const groundTexture = this.entityLoader.entityTextureBank?.[currentMapGround?.entityUuid]
    if (groundTexture) {
      groundTexture.wrapS = RepeatWrapping
      groundTexture.repeat.set(1, 1)

      entry.material = new MeshPhongMaterial({ map: groundTexture })
    }

    const { x, y, z } = currentMapGround.position
    entry.position.set(x, y, z)
    this.scene.add(entry)

    // Physics
    let physics = new BoxCollider({ size: new Vector3(entry.scale.x / 2, entry.scale.y / 2, entry.scale.z / 2) })
    physics.body.position.copy(cannonVector(entry.position))
    physics.body.quaternion.copy(cannonQuaternion(entry.quaternion))
    physics.body.computeAABB()

    physics.body.shapes.forEach((shape) => {
      shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders
    })

    this.world.physicsWorld.addBody(physics.body)
  }

  handleEvent = (currentMapEvent: IMapEvent) => {
    const { x, y , z } = currentMapEvent.position
    const evtPosition = new Vector3(x, y, z)

    new Event(this.world, evtPosition, currentMapEvent.eventUuid)
  }

  handleProp = (currentMapProp: IMapProp) => {
    const { x, y, z } = currentMapProp.position

    const groundObject = this.entityLoader.entityPropBank?.[currentMapProp?.entityUuid]?.clone()

    // TODO: When we delete an entity, we should do a cleanup on all the maps that entity was placed and remove them one by one
    if (!groundObject) {
      console.warn('Could not find current map entity uuid prop to render: ', currentMapProp?.entityUuid)
      return
    }

    groundObject.receiveShadow = true
    groundObject.castShadow = true

    groundObject.position.set(x, y, z)
    this.scene.add(groundObject)
  }

}
