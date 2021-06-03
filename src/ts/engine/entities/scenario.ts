import { IMap } from "../../editor/interfaces/IMap"
import { IMapEvent } from "../../editor/interfaces/IMapEvent"
import { IMapGround } from "../../editor/interfaces/IMapGround"
import {  BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D, PointLight, TextureLoader, Vector3 } from "three"
import { Character } from "../characters/character"
import { LoadingManager } from "../core/loading-manager"
import { UIManager } from "../core/ui-manager"
import { World } from "./world"
import { BoxCollider } from "../physics/colliders/box-collider"
import { cannonQuaternion, cannonVector } from "../utils/function-library"
import { CollisionGroups } from "../enums/collision-groups"
import { Event } from "../event-system/event"
import { DatabaseActorsStorage, EntitiesStorage, MapStorage } from "src/ts/storage"
import { getResources } from "src/ts/storage/resources"
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter"
import { IActor } from "src/ts/editor/interfaces/IActor"
import { EntityType } from "../interfaces/IWorldEntity"
import { Texture } from "three"
import { RepeatWrapping } from "three"


var light = new PointLight(0xffffff)
light.position.set(100, 250, 100)

var groundMesh = new Mesh(new BoxGeometry(1, 1, 1))


export class Scenario {
  public mapUuid: string
  public map: IMap

  public spawnAlways = false
  public default = false

  public world: World
  public spawnPoint: Vector3

  public loadingManager: LoadingManager;

  entityTextureBank: { [entityUuid: string]: Texture } = {}

  constructor(world: World, mapUuid: string) {
    this.world = world
    this.mapUuid = mapUuid

    this.map = MapStorage.getCurrentMap()

    this.loadTextures()
    this.loadingManager = new LoadingManager(world)
  }

  loadTextures = () => {
    const entities = EntitiesStorage.get()

    entities.forEach(entity => {
      const entityResource = EntitiesStorage.getEntityResource(entity.uuid)
      this.entityTextureBank[entity.uuid] = new TextureLoader().load(entityResource.downloadUrl)
    })
  }

  launch = (world: World): void => {
    document.exitPointerLock();

    world.clearEntities()

    world.cameraOperator.theta = 1
    world.cameraOperator.phi = 15

    UIManager.setLoadingScreenVisible(true)

    this.drawMap()

    this.loadingManager.onFinishedCallback = () => {
      this.world.update(1, 1)
      this.world.setTimeScale(1)

      this.world.inputManager.setPointerLock(true)
      UIManager.setLoadingScreenVisible(false)
    }
  }

  drawMap = (): void => {
    const scene = new Object3D()

    let width = this.map.settings.width
    let depth = this.map.settings.depth
    let height = 10

    const currentMap = this.map
    const currentMapGrounds = currentMap?.grounds || []
    const currentMapEvents = currentMap?.events || []

    const sceneChildren: Mesh[] = []

    let mapStartingPosition: Vector3 | null = null

    for (let i = -width / 2; i < width / 2; i++) {
      for (let j = -depth / 2; j < depth / 2; j++) {
        for (let h = -height / 2; h < height / 2; h++) {
          this.handleEvent(i, h, j, currentMapEvents)
          this.handleGround(i, h, j, currentMapGrounds, sceneChildren)
        }
      }
    }

    scene.add(this.world.sky)
    scene.add(light)
    scene.add(...sceneChildren)

    const initialPosition = currentMap?.startingPosition || new Vector3(0, 0, 0)
    this.spawnPlayer(initialPosition)

    this.world.graphicsWorld.add(scene)
  }

  handleEvent = (x: number, y: number, z: number, currentMapEvents: IMapEvent[]) => {
    const paintedEvent = currentMapEvents.find(event =>
        event.position.x === x
        && event.position.y === y
        && event.position.z === z)
    if (!paintedEvent) {
      return
    }

    const evtPosition = new Vector3(x, y, z)

    new Event(this.world, evtPosition, paintedEvent.eventUuid)
  }

  handleGround = (x: number, y: number, z: number, currentMapGrounds: IMapGround[], sceneChildren: Mesh[]) => {
    const paintedGround = currentMapGrounds.find((ground) =>
      ground.position.x === x
      && ground.position.y === y
      && ground.position.z === z)
    if (!paintedGround) {
      return
    }
    var entry: Mesh;
    entry = groundMesh.clone()

    const ground = this.entityTextureBank?.[paintedGround?.entityUuid]
    if (ground) {
      ground.wrapS = RepeatWrapping
      ground.repeat.set(1, 1)
    }
    entry.material = new MeshBasicMaterial({ map: ground })

    entry.position.set(x, y, z)
    sceneChildren.push(entry)

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

  spawnPlayer = (initialPosition: Vector3) => {
    const actor = DatabaseActorsStorage.get()?.[0] as IActor
    const actorGraphic = getResources()?.characters?.find(x => x.uuid == actor.graphicUuid) as IResourceCharacter

    this.loadingManager.loadFbx(actorGraphic.downloadUrl, (model: Group) => {
      model.scale.setScalar(actorGraphic.scale)

      let player = new Character(model, actorGraphic.animationClips, this.world)
      player.entityType = EntityType.PLAYER

      player.setPosition(initialPosition.x, initialPosition.y + 1, initialPosition.z)

      this.world.add(player)

      player.takeControl()
    })
  }

}
