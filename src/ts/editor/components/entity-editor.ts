import shortid = require("shortid");
import { Theme } from "../config/theme";
import { IEntity, IGround } from "../interfaces/IEntity";
import { createActionButtonGUI, createActionPanelGUI, createListPanelGUI } from "../utils/ui";

const GUI_PANEL_HEIGHT = 300
const ITEM_PANEL_HEIGHT = 200

type EntityType = 'ground' | 'walls' | 'props'

const grounds: IGround[] = [
  {
    uuid: shortid.generate(),
    name: 'ground',
    color: 'green'
  },
  {
    uuid: shortid.generate(),
    name: 'dirt',
    color: 'yellow'
  },
  {
    uuid: shortid.generate(),
    name: 'stone',
    color: 'grey'
  },

]

export class EntityEditor {
  // Dependencies

  // Assets
  public grounds: IGround[] = grounds

  // GUI
  public guiPanel: HTMLElement
  public itemsPanel: HTMLElement
  public actionsPanel: HTMLElement

  public uiContainer: HTMLElement

  // Mode Selection
  private _currentMode: EntityType = 'ground'

  public get currentMode() {
    return this._currentMode
  }

  public set currentMode(value: EntityType) {
    this._currentMode = value

    // Redraw Gui
    this.redrawPanelButtonsGui()
    this.redrawEntitiesListGui()
  }

  // Entity Selection
  public onEntityChange: () => void;

  private _currentEntity: IEntity = grounds?.[0]

  public get currentEntity() {
    return this._currentEntity
  }

  public set currentEntity(value: IEntity) {
    this._currentEntity = value

    // Notify subscribers
    if (this.onEntityChange) {
      this.onEntityChange()
    }

    // Redraw GUI
    this.redrawEntitiesListGui()
  }

  constructor(
    uiContainer: HTMLElement,
  ) {
    this.uiContainer = uiContainer

    this.drawGui()
  }

  // GUI
  drawGui = () => {
    // Gui Panel
    this.guiPanel = document.createElement('div')
    this.guiPanel.innerHTML = `<h3>Entity Editor</h3>`
    const guiPanelStyle = this.guiPanel.style
    guiPanelStyle.width = `100%`
    guiPanelStyle.height = `100%`
    guiPanelStyle.height = `${GUI_PANEL_HEIGHT}px`
    guiPanelStyle.color = `${Theme.DARK}`
    guiPanelStyle.marginBottom = `10px`

    // Scrollable Item List Panel
    this.itemsPanel = createListPanelGUI(ITEM_PANEL_HEIGHT)
    this.redrawEntitiesListGui()
    this.guiPanel.appendChild(this.itemsPanel)
    
    this.actionsPanel = createActionPanelGUI()
    this.redrawPanelButtonsGui()

    this.guiPanel.appendChild(this.actionsPanel)
    this.uiContainer.appendChild(this.guiPanel)
  }

  redrawEntitiesListGui = () => {
    this.itemsPanel.innerHTML = ''
    const itemsPanelStyle = this.itemsPanel.style
    itemsPanelStyle.background = Theme.NEUTRAL_DARK
    itemsPanelStyle.padding = `5px`

    let entities: IEntity[] = []

    if (this.currentMode === 'ground') {
      entities = this.grounds
    }

    entities.forEach(entity => {
      const entityBtn = document.createElement('button')
      const btnStyle = entityBtn.style
      btnStyle.width = '20%'
      btnStyle.height = '60px'
      btnStyle.margin = '1px'

      const ground = entity as IGround
      btnStyle.background = ground?.color || Theme.PRIMARY

      btnStyle.cursor = 'pointer'

      const isSelected = entity.uuid === this.currentEntity?.uuid

      btnStyle.border = `1px solid ${Theme.NEUTRAL_DARKER}`
      btnStyle.opacity = isSelected ? '1' : '0.25'
      btnStyle.color = Theme.DARK

      entityBtn.innerHTML = entity.name

      entityBtn.onclick = () => {
        this.currentEntity = entity
      }
      
      this.itemsPanel.appendChild(entityBtn)
    })
  }

  redrawPanelButtonsGui = () => {
    this.actionsPanel.innerHTML = ''
    this.actionsPanel.appendChild(this.createActionButtonGui('ground'))
    this.actionsPanel.appendChild(this.createActionButtonGui('walls'))
    this.actionsPanel.appendChild(this.createActionButtonGui('props'))
  }

  createActionButtonGui(type: EntityType): HTMLButtonElement {
    const label = type.toUpperCase()

    const isActive = type === this.currentMode
    const btn = createActionButtonGUI(label, isActive)
    btn.onclick = () => { this.currentMode = type }

    return btn
  }

}
