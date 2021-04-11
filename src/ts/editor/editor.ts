import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { DatabaseActors } from "./components/database-actors";
import { EntityEditor } from "./components/entity-editor";
import { InputManager } from "./components/input-manager";
import { MapEditor } from "./components/map-editor";
import { SceneEditor } from "./components/scene-editor";
import { ToolbarEditor } from "./components/toolbar-editor";
import { Theme } from "./config/theme";
import { IGround } from "./interfaces/IEntity";
import { ToolbarMode } from "./interfaces/ToolbarMode";

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

  // Managers
  private inputManager: InputManager

  // Database
  private databaseActors: DatabaseActors

  // Html Elements
  private navbarUi: HTMLElement
  private sidebarUi: HTMLElement

  private brush: Mesh

  private isPainting: boolean
  private lastPaintedPosition: Vector3 = new Vector3()
  
  constructor() {
    this.drawGui()
    this.toolbarEditor = new ToolbarEditor(this.navbarUi)
    this.toolbarEditor.onSave = this.onSave
    this.toolbarEditor.onLoad = this.onLoad

    this.entityEditor = new EntityEditor(this.sidebarUi)

    // Map Editor
    this.mapEditor = new MapEditor(this.sidebarUi)   
    this.mapEditor.onMapSelection = this.onMapSelection

    this.sceneEditor = new SceneEditor(this.mapEditor)

    // Managers
    this.inputManager = new InputManager();
    this.inputManager.onKeyPressedChange = this.handleKeys;

    // Database
    this.databaseActors = new DatabaseActors()

    // Add brush to scene
    this.renderBrush()

    // Event Listeners
    this.entityEditor.onEntityChange = this.onEntityChange
    this.sceneEditor.onIntersection = this.onIntersection
  }

  renderBrush = () => {
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
    this.mapEditor.commitCurrentMapChanges()

    this.sceneEditor.redrawScene()
  }

  onIntersection = (intersection: Intersection) => {
    this.sceneEditor.scene.add(this.brush)

    var intersectionPosition = intersection.point.round()
    const ground = this.entityEditor.currentEntity as IGround
    if (ground) {
      this.brush.material = new MeshBasicMaterial({ color: ground.color })
    }

    var nextPosition = intersectionPosition.clone()
    this.brush.position.set(nextPosition.x, -0.49, nextPosition.z)

    if (nextPosition?.equals(this?.lastPaintedPosition)) {
      return
    }

    if (
      this.isPainting
      && this.entityEditor.currentEntity
      && this.mapEditor.currentMap
    ) {

      this.mapEditor.paintMap({
        position: nextPosition,
        color: ground?.color,
      })

      this.lastPaintedPosition = nextPosition
      this.sceneEditor.redrawScene()
    }
  }

  handleKeys = (keysPressed: string[]) => {
    this.handlePaintMode(keysPressed)
  }

  handlePaintMode = (keysPressed: string[]) => {
    const allKeysPressed = EditorKeys.PAINT_MODE.every(key => keysPressed.includes(key))

    if (!allKeysPressed) {
      this.isPainting = false
      return;
    }

    if (this.toolbarEditor.mode !== ToolbarMode.DRAW) {
      this.toolbarEditor.mode = ToolbarMode.DRAW
    }

    if (!this.isPainting) {
      this.isPainting = true
    }
  }

  onSave = () => {
    this.mapEditor.save()
  }

  onLoad = () => {
    this.mapEditor.load()
  }

}
