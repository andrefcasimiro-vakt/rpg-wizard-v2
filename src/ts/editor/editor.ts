import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { EntityEditor } from "./components/entity-editor";
import { InputManager } from "./components/input-manager";
import { MapEditor } from "./components/map-editor";
import { SceneEditor } from "./components/scene-editor";
import { ToolbarEditor } from "./components/toolbar-editor";
import { Theme } from "./config/theme";
import { IGround } from "./interfaces/IEntity";
import { ToolbarMode } from "./enums/ToolbarMode";
import shortid = require("shortid");
import { getCurrentMap } from "../storage/maps";
import { EventEditor } from "./components/events/event-editor";

const NAVBAR_HEIGHT = 50
const SIDEBAR_WIDTH = 300

export const EditorKeys = {
  PAINT_MODE: ['ShiftLeft'],
}

export class Editor {
  // Editors
  private toolbarEditor: ToolbarEditor;
  private entityEditor: EntityEditor;
  private mapEditor: MapEditor;
  private sceneEditor: SceneEditor;
  private eventEditor: EventEditor;

  // Managers
  private inputManager: InputManager

  // Html Elements
  private navbarUi: HTMLElement
  private sidebarUi: HTMLElement

  // Scene
  private isPainting: boolean
  private brush: Mesh
  private lastPaintedPosition: Vector3 = new Vector3()
  
  constructor() {
    this.drawGui()
    this.toolbarEditor = new ToolbarEditor(this.navbarUi)
    this.toolbarEditor.onSave = this.onSave
    this.toolbarEditor.onLoad = this.onLoad
    this.toolbarEditor.onModeChange = this.onModeChange

    this.entityEditor = new EntityEditor(this.sidebarUi)

    // Map Editor
    this.mapEditor = new MapEditor(this.sidebarUi)   
    this.mapEditor.onMapSelection = this.onMapSelection

    this.sceneEditor = new SceneEditor(this.mapEditor, this.toolbarEditor)

    // Managers
    this.inputManager = new InputManager();
    this.inputManager.onKeyPressedChange = this.handleKeys;

    // Events
    this.eventEditor = new EventEditor()

    // Add brush to scene
    this.initBrush()

    // Event Listeners
    this.entityEditor.onEntityChange = this.onEntityChange
    this.sceneEditor.onIntersection = this.onIntersection
    this.sceneEditor.onDoubleClickIntersection = this.onDoubleClickIntersection
  }

  initBrush = () => {
    this.brush = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'red' }))
    this.brush.visible = true
  }

  // UI
  drawGui = () => {
    this.navbarUi = document.createElement('nav')
    const navStyle = this.navbarUi.style
    navStyle.position = 'absolute'
    navStyle.top = '0'
    navStyle.height = `${NAVBAR_HEIGHT}px`
    navStyle.display = 'flex'
    navStyle.width = '100%'

    document.body.appendChild(this.navbarUi)

    this.sidebarUi = document.createElement('div')

    const style = this.sidebarUi.style
    style.position = 'absolute'
    style.display = 'flex'
    style.flexDirection = 'column'
    style.width = `${SIDEBAR_WIDTH}px`
    style.paddingLeft = `5px`
    style.paddingRight = `5px`
    style.height = `calc(100% - ${NAVBAR_HEIGHT}px)`
    style.background = `${Theme.NEUTRAL}`
    style.borderRight = `1px solid ${Theme.PRIMARY_DARK}`
    style.overflow = 'scroll'
    style.top = `${NAVBAR_HEIGHT + 1}px`
    
    document.body.appendChild(this.sidebarUi)
  }

  onEntityChange = () => {
    const ground = this.entityEditor.currentEntity as IGround

    if (ground) {
      this.brush.material = new MeshBasicMaterial({ color: ground.color })
    }
  }

  onMapSelection = () => {
    this.sceneEditor?.drawScene()
  }

  onDoubleClickIntersection = (intersection: Intersection) => {
    var intersectionPosition = intersection.point.round()

    const targetEvent = getCurrentMap().layers[0].events.find(evt => {
      const pos = new Vector3(evt.position.x, evt.position.y, evt.position.z).round()
      return pos.equals(intersectionPosition)
    })

    if (targetEvent) {
      this.eventEditor.open(targetEvent.eventUuid)
    }
  }

  onIntersection = (intersection: Intersection) => {
    this.sceneEditor.scene.add(this.brush)

    var intersectionPosition = intersection.point.round()

    const ground = this.entityEditor.currentEntity as IGround
    if (this.toolbarEditor.mode === ToolbarMode.EVENT) {
      this.brush.material = new MeshBasicMaterial({ color: 'purple' })
    } else if (ground) {
      this.brush.material = new MeshBasicMaterial({ color: ground.color })
    }

    var nextPosition = intersectionPosition.clone()
    this.brush.position.set(nextPosition.x, 0.01, nextPosition.z)

    if (nextPosition?.equals(this?.lastPaintedPosition)) {
      return
    }

    // Starting Position Mode
    if (this.isPainting && this.toolbarEditor.mode === ToolbarMode.STARTING_POSITION) {
      this.mapEditor.clearStartingPosition()
      this.sceneEditor.drawScene({ queuedStartingPosition: nextPosition })
      this.lastPaintedPosition = nextPosition
      return;
    }

    // Event Mode
    if (this.isPainting && this.toolbarEditor.mode === ToolbarMode.EVENT) {
      this.sceneEditor.drawScene({ queuedEvent: { position: nextPosition, eventUuid: shortid.generate() } })
      this.lastPaintedPosition = nextPosition
      return;
    }

    // Fill Mode
    if (this.toolbarEditor.mode === ToolbarMode.FILL) {      
      this.sceneEditor.drawScene({ fillColor: ground.color })
      return;
    }

    // Paint Mode
    if (this.isPainting && this.toolbarEditor.mode === ToolbarMode.DRAW) {      
      this.sceneEditor.drawScene({ queuedGround: { position: nextPosition, color: ground.color } })
      this.lastPaintedPosition = nextPosition
    }
  }

  handleKeys = (keysPressed: string[]) => {
    const isPainting = EditorKeys.PAINT_MODE.every(key => keysPressed.includes(key))

    this.isPainting = isPainting
  }

  onModeChange = () => {
    this.sceneEditor.drawScene()
  }

  onSave = () => {
    this.mapEditor.save()
  }

  onLoad = () => {
    this.mapEditor.load()
  }

}
