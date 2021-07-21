import { xor } from "lodash";
import _ = require("lodash");
import shortid = require("shortid");
import { EntityType } from "src/ts/editor/enums/EntityType";
import { IMapProp } from "src/ts/editor/interfaces/IMapProp";
import { EntitiesStorage, MapStorage } from "src/ts/storage";
import { getEvents, setEvents } from "src/ts/storage/events";
import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, Object3D, RepeatWrapping, Scene, Texture, TextureLoader, Vector, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Editor } from "../../editor";
import { EventTrigger } from "../../enums/EventTrigger";
import { ToolbarMode } from "../../enums/ToolbarMode";
import { IGround } from "../../interfaces/IEntity";
import { IEvent } from "../../interfaces/IEvent";
import { IMap } from "../../interfaces/IMap";
import { IMapEvent } from "../../interfaces/IMapEvent";
import { IMapGround } from "../../interfaces/IMapGround";
import { EntityEditor } from "../entity-editor/entity-editor";
import { EventEditor } from "../events/event-editor";
import { MapListEditor } from "../map-list-editor/map-list-editor";
import { SceneRenderer } from "../scene-renderer/scene-renderer";
import { ToolbarEditor } from "../toolbar-editor";

const PLACEHOLDER_TILE_NAME = 'PLACEHOLDER_TILE_NAME'
export class MapEditor extends SceneRenderer {

  groundMesh: Mesh
  squareT: Texture;
  basePlane: Mesh;
  basePlaneTransparent: Mesh;
  
  brush: Mesh

  editor: Editor
  toolbarEditor: ToolbarEditor
  eventEditor: EventEditor
  entityEditor: EntityEditor
  mapListEditor: MapListEditor

  currentMap: IMap = null

  currentLayer = 0

  entityTextureBank: { [entityUuid: string]: Texture } = {}
  entityPropBank: { [entityUuid: string]: Object3D } = {}

  showGrid = true

  constructor(editor: Editor) {
    super({ ambientLightColor: '#FFF', skyboxColor: '#FFF' })

    this.editor = editor
    this.toolbarEditor = editor.toolbarEditor
    this.entityEditor = editor.entityEditor
    this.entityEditor.onEntityChange = this.onEntityChange
    this.eventEditor = editor.eventEditor
    this.mapListEditor = editor.mapListEditor
    this.mapListEditor.onMapSelected = this.onMapSelected
    this.currentMap = MapStorage.getCurrentMap()

    this.initGridSettings()

    this.resources()

    this.initBrush()

    this.renderScene()

    window.addEventListener('keydown', this.handleKeys)
  }

  onMapSelected = () => {
    this.currentMap = MapStorage.getCurrentMap()

    this.renderScene()
  }

  initGridSettings = () => {
    this.groundMesh = new Mesh(new BoxGeometry(1, 1, 1))

    this.squareT = new TextureLoader().load('build/assets/square-thick.png')
    this.squareT.wrapS = RepeatWrapping
    this.squareT.repeat.set(1, 1)

    var planeGeo = new BoxGeometry(1, 1, 1)
    planeGeo.scale(1, 1, 1)
    var planeMat = new MeshBasicMaterial({ transparent: true, map: this.squareT, color: 0xbbbbbb, opacity: 0.009 })
    this.basePlane = new Mesh(planeGeo, planeMat)
    this.basePlane.rotation.x = -Math.PI / 2

    this.basePlaneTransparent = this.basePlane.clone()
    this.basePlaneTransparent.material = new MeshBasicMaterial({ transparent: true, opacity: 0 })
  }

  resources = () => {
    const entities = EntitiesStorage.get()

    const fbxLoader = new FBXLoader()
    const textureLoader = new TextureLoader()

    entities.forEach(entity => {
      const { entityResource, category } = EntitiesStorage.getEntityResource(entity.uuid)

      if (!entityResource) {
        return;
      }

      if (category == EntityType.Props) {
        fbxLoader.load(entityResource.downloadUrl, (object) => {
          object.scale.setScalar(0.01)
          this.entityPropBank[entity.uuid] = object;
        })
      } else if (category == EntityType.Tiles) {
        this.entityTextureBank[entity.uuid]  = textureLoader.load(entityResource.downloadUrl)
      }
      
    })

  }

  initBrush = () => {
    this.brush = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'red' }))
    this.brush.visible = true
  }

  update = () => {
    super.update()

    this.handleRaycast()
  }

  public onDoubleClick(event: MouseEvent) {
    super.onDoubleClick(event)

    this.handleRaycast({ doubleClicked: true })
  }

  handleRaycast = (options?: {
    doubleClicked?: boolean,
  }) => {
    if (!this.canCastRaycast()) {
      return
    }

    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    const intersectionObjects = this.scene.children.filter(x =>
        x.name == PLACEHOLDER_TILE_NAME
    )

    const intersections = this
      .raycaster
      .intersectObjects(intersectionObjects)

    // Capture the first intersection only
    if (intersections?.length) {
      if (options?.doubleClicked) {
        this.onDoubleClickIntersection(intersections[0])
      } else {
        this.onIntersection(intersections[0])
      }
    }
  }

  canCastRaycast = (): boolean => {
    const modal = document.getElementById('modal')
    return modal.style.display == 'none'
  }

  onDoubleClickIntersection = (intersection: Intersection) => {
    var intersectionPosition = intersection.point.round()

    const targetEvent = MapStorage.getCurrentMap().events.find(evt => {
      const x = intersectionPosition.x
      const y = intersectionPosition.y - 1
      const z = intersectionPosition.z
      const pos = new Vector3(evt.position.x, evt.position.y, evt.position.z).round()
      console.log('pos: ', pos)

      return pos.x == x && pos.y == y && pos.z == z
    })

    if (targetEvent) {
      this.eventEditor.open(targetEvent.eventUuid)
    }
  }

  handlePaintGround = (nextPosition: Vector3) => {
    if (EntitiesStorage.getCurrentMode() !== EntityType.Tiles) {
      return;
    }

    const currentEntityUuid = EntitiesStorage.getCurrentEntity()?.uuid

    const ground = this.entityTextureBank?.[currentEntityUuid]
    if (ground?.wrapS) {
      ground.wrapS = RepeatWrapping
      ground.repeat.set(1, 1)
    }

    if (this.toolbarEditor.mode === ToolbarMode.DRAW && ground) {      
      this.brush.material = new MeshBasicMaterial({ map: ground })
    }

    if (this.editor.isPainting) {
      this.paintGround(nextPosition, currentEntityUuid)
    }
  }

  handlePaintProp = (nextPosition: Vector3) => {
    if (EntitiesStorage.getCurrentMode() !== EntityType.Props) {
      return;
    }

    const currentEntityUuid = EntitiesStorage.getCurrentEntity()?.uuid

    if (this.toolbarEditor.mode === ToolbarMode.DRAW) {      
      this.brush.material = new MeshBasicMaterial({ color: 'green' })
    }

    if (this.editor.isPainting) {
      this.paintProp(nextPosition, currentEntityUuid)
    }
  }

  handlePaintEvent = (nextPosition: Vector3) => {
    if (this.toolbarEditor.mode === ToolbarMode.EVENT) {
      this.brush.material = new MeshBasicMaterial({ color: 'purple' })
    }

    if (this.editor.isPainting) {
      this.paintEvent(nextPosition)
    }
  }
  
  handlePaintStartPosition = (nextPosition: Vector3) => {
    if (this.toolbarEditor.mode === ToolbarMode.STARTING_POSITION) {
      this.brush.material = new MeshBasicMaterial({ color: 'yellow' })
    }

    if ((this.editor.isPainting) {
      this.paintStartingPosition(nextPosition)    
    }
  }

  onIntersection = (intersection: Intersection) => {
    var intersectionPosition = intersection.point.round()

    var nextPosition = intersectionPosition.clone()
    nextPosition.y = this.currentLayer
    this.brush.position.set(nextPosition.x, this.currentLayer + 0.01, nextPosition.z)

    this.handlePaintGround(nextPosition)

    this.handlePaintProp(nextPosition)

    this.handlePaintEvent(nextPosition)

    this.handlePaintStartPosition(nextPosition)
    
    if (this.editor.isDeleting) {
      if (this.toolbarEditor.mode == ToolbarMode.EVENT) {
        this.removeEvent(nextPosition)
      }

      if (this.toolbarEditor.mode == ToolbarMode.DRAW) {
        this.removeGround(nextPosition)
      }
    }
  }

  paintGround = (nextPosition: Vector3, entityUuid: string) => {
    const grounds = this.currentMap.grounds || []
    const idx = grounds.findIndex(x =>
        x.position.x == nextPosition.x
        && x.position.y == nextPosition.y
        && x.position.z == nextPosition.z
    )

    const payload: IMapGround = { position: nextPosition.clone(), entityUuid }
    if (idx != -1) {
      grounds[idx] = payload
    } else {
      grounds.push(payload)
    }

    MapStorage.update({
      ...this.currentMap,
      grounds,
    })

    this.renderScene()
  }

  paintProp = (nextPosition: Vector3, entityUuid: string) => {
    const props = this.currentMap.props || []
    const idx = props.findIndex(x =>
        x.position.x == nextPosition.x
        && x.position.y == nextPosition.y
        && x.position.z == nextPosition.z
    )

    const payload: IMapProp = { position: nextPosition.clone(), entityUuid }
      console.log(payload)
      console.log(props)
    if (idx != -1) {
      props[idx] = payload
    } else {
      props.push(payload)
    }

    MapStorage.update({
      ...this.currentMap,
      props,
    })

    this.renderScene()
  }

  paintEvent = (nextPosition: Vector3) => {
    const events = this.currentMap.events || []

    // Don't paint over an existing event
    if (events.find(evt =>
        evt.position.x == nextPosition.x
        && evt.position.y == nextPosition.y
        && evt.position.z == nextPosition.z
      )) {
        return
      }

    const eventUuid = shortid.generate()

    const idx = events.findIndex(evt =>
        evt.position.x == nextPosition.x
        && evt.position.y == nextPosition.y
        && evt.position.z == nextPosition.z)

        const payload: IMapEvent = {
      eventUuid,
      position: nextPosition,
    }

    if (idx != -1) {
      events[idx] = payload
    } else {
      events.push(payload)
    }

    MapStorage.update({
      ...this.currentMap,
      events,
    })

    // Save event to event storage
    const nextState = getEvents() || []
    nextState.push({
      uuid: eventUuid,
      eventPages: [{
        uuid: shortid.generate(),
        switches: [],
        actions: [],
        graphicUuid: '',
        trigger: EventTrigger.ON_ACTION_KEY_DOWN,
      }]
    })
    setEvents(nextState)

    this.renderScene()
  }

  removeEvent = (position: Vector3) => {
    const events = this.currentMap.events || []

    const idx = events.findIndex(evt =>
      evt.position.x == position.x
      && evt.position.y == position.y
      && evt.position.z == position.z
    )
    
    if (idx == -1) {
      return
    }

    const storageEvents = getEvents() || []
    console.log(events[idx])
    const nextState = storageEvents.filter(x => x.uuid != events[idx].eventUuid)
    setEvents(nextState)

    _.pull(events, events[idx])

    MapStorage.update({
      ...this.currentMap,
      events,
    })

    this.renderScene()
  }

  removeGround = (position: Vector3) => {
    const grounds = this.currentMap.grounds || []

    const idx = grounds.findIndex(evt =>
      evt.position.x == position.x
      && evt.position.y == position.y
      && evt.position.z == position.z
    )
    
    if (idx == -1) {
      return
    }

    _.pull(grounds, grounds[idx])

    MapStorage.update({
      ...this.currentMap,
      grounds,
    })

    this.renderScene()
  }

  paintStartingPosition = (nextPosition: Vector3) => {
    MapStorage.setStartingPosition(nextPosition)
    this.renderScene()
  }

  onEntityChange = () => {
    const ground = this.entityTextureBank?.[EntitiesStorage.getCurrentEntity().uuid]

    if (ground?.wrapS) {
      ground.wrapS = RepeatWrapping
      ground.repeat.set(1, 1)
    }

    if (ground) {
      this.brush.material = new MeshBasicMaterial({ map: ground })
    }
  }

  renderGrounds = () => {
    const mapWidth = this.currentMap.settings?.width
    const mapDepth = this.currentMap.settings?.depth
    const mapHeight = 10
    const currentMapGrounds = this.currentMap.grounds

    const groundMaterial = new MeshBasicMaterial()

    for (let i = -mapWidth / 2; i < mapWidth / 2; i++) {
      for (let j = -mapDepth / 2; j < mapDepth / 2; j++) {
        for (let h = -mapHeight / 2; h < mapHeight / 2; h++) {

          const existingGround = currentMapGrounds.find(ground => {
            return ground.position.x == i && ground.position.y == h && ground.position.z == j
          })

          if (existingGround) {
            var entry = this.groundMesh.clone()
            entry.position.set(i, h, j)

            const ground = this.entityTextureBank?.[existingGround?.entityUuid]

            if (ground?.wrapS) {
              ground.wrapS = RepeatWrapping
              ground.repeat.set(1, 1)
            }
            entry.material = groundMaterial.clone()
            // @ts-ignore
            entry.material.map = ground

            this.scene.add(entry)
            continue
          }

          var placeholderTile = this.showGrid ? this.basePlane.clone() : this.basePlaneTransparent.clone()

          placeholderTile.position.set(i, this.currentLayer, j)
          placeholderTile.name = PLACEHOLDER_TILE_NAME
          this.scene.add(placeholderTile)
        }
      }
    }
  }

  renderProps = () => {
    const currentMapProps = this.currentMap?.props || []
    currentMapProps.forEach(mapProp => {
      const prop = this.entityPropBank?.[mapProp?.entityUuid]?.clone()
      if (!prop) {
        return
      }

      prop.position.set(mapProp.position.x, mapProp.position.y, mapProp.position.z)
      this.scene.add(prop)
    })
  }

  renderEvents = () => {
    const currentMapEvents = this.currentMap.events || []

    currentMapEvents.forEach(mapEvent => {
      var entry = this.groundMesh.clone()
      const position = new Vector3(mapEvent.position.x, mapEvent.position.y, mapEvent.position.z)
      entry.position.set(position.x, position.y + .1, position.z)
      entry.scale.setScalar(.9)
      entry.name = PLACEHOLDER_TILE_NAME
      entry.material = new MeshBasicMaterial({ color: 'purple', opacity: 0.9, transparent: true })
      this.scene.add(entry)
    })
  }

  renderStartingPosition = () => {
    const startingPosition = MapStorage.getStartingPosition()
    if (startingPosition == null) {
      return
    }

    var entry = this.groundMesh.clone()
    entry.position.set(startingPosition.x, startingPosition.y + 0.01, startingPosition.z)
    entry.material = new MeshBasicMaterial({ color: 'yellow', opacity: 0.9, transparent: true })
    this.scene.add(entry)
  }

  renderScene = () => {
    this.clearScene()

    this.renderGrounds()
    this.renderProps()

    if (this.toolbarEditor.mode == ToolbarMode.EVENT) {
      this.renderEvents()
      this.renderStartingPosition()
    }

    if (this.toolbarEditor.mode == ToolbarMode.STARTING_POSITION) {
      this.renderStartingPosition()
    }

    this.scene.add(this.ambientLight)
    this.scene.add(this.skybox)
    this.scene.add(this.brush)
  }

  clearScene = () => {
    this.scene = new Scene()
  }

  handleKeys = (evt: KeyboardEvent) => {
    if (evt.code == 'ArrowUp') {
      this.currentLayer += 1

      this.renderScene()
    }

    if (evt.code == 'ArrowDown') {
      this.currentLayer -= 1

      this.renderScene()
    }

    if (evt.code == 'KeyH') {
      this.showGrid = !this.showGrid
      this.renderScene()
    }
    
  }

}
