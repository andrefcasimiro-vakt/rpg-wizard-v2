import { EntityEditor } from "./components/entity-editor/entity-editor";
import { InputManager } from "./components/input-manager";
import { ToolbarEditor } from "./components/toolbar-editor";

import { EventEditor } from "./components/events/event-editor";
import { MapEditor } from "./components/map-editor/map-editor";

import * as styles from './editor.css'
import { createElement } from "./utils/ui";
import { MapListEditor } from "./components/map-list-editor/map-list-editor";

// const NAVBAR_HEIGHT = 50
// const SIDEBAR_WIDTH = 300

export const EditorKeys = {
  PAINT_MODE: ['ShiftLeft'],
}

export class Editor {
  // Editors
  toolbarEditor: ToolbarEditor;
  entityEditor: EntityEditor;
  mapListEditor: MapListEditor;
  mapEditor: MapEditor;
  eventEditor: EventEditor;

  // Managers
  private inputManager: InputManager

  // Html Elements
  private navbarUi: HTMLElement
  private sidebarUi: HTMLElement

  // Scene
  isPainting: boolean
  
  constructor() {
    this.drawGui()

    this.toolbarEditor = new ToolbarEditor(this.navbarUi)
    this.toolbarEditor.onModeChange = this.onModeChange

    this.entityEditor = new EntityEditor(this.sidebarUi)
    this.mapListEditor = new MapListEditor(this.sidebarUi)

    this.inputManager = new InputManager();
    this.inputManager.onKeyPressedChange = this.handleKeys;

    this.eventEditor = new EventEditor()
    this.mapEditor = new MapEditor(this)
  }

  // UI
  drawGui = () => {
    this.navbarUi = createElement('nav', styles.nav)
    document.body.appendChild(this.navbarUi)

    this.sidebarUi = createElement('div', styles.sidebar)
    document.body.appendChild(this.sidebarUi)
  }

  onMapSelection = () => {
    this.mapEditor.renderScene()
  }

  handleKeys = (keysPressed: string[]) => {
    const isPainting = EditorKeys.PAINT_MODE.every(key => keysPressed.includes(key))

    this.isPainting = isPainting
  }

  onModeChange = () => {
    this.mapEditor.renderScene()
  }
}
