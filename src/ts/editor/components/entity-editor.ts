import shortid = require("shortid");
import { IEntity, IGround } from "../interfaces/IEntity";

type EntityType = 'ground' | 'walls' | 'props' | 'events'

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
]

export class EntityEditor {
  
  public selectedMode: EntityType = 'ground'
  
  public selectedEntity: IEntity = grounds[0]

  // Assets
  public grounds: IGround[] = grounds

  // GUI
  public guiPanel: HTMLElement
  public itemsPanel: HTMLElement
  public actionsPanel: HTMLElement

  public uiContainer: HTMLElement

  public onEntityChange: () => void;

  constructor(uiContainer: HTMLElement) {
    this.uiContainer = uiContainer
    this.init()
  }

  init() {
    this.attachGui()
  }


  attachGui() {
    this.guiPanel = document.createElement('div')
    this.guiPanel.innerHTML = `<h2>Asset list</h2>`
    this.guiPanel.style.width = `200px`
    this.guiPanel.style.height = `100%`
    this.guiPanel.style.padding = `10px`
    this.guiPanel.style.height = `calc(100% - 500px)`
    this.guiPanel.style.color = '#FFF'

    this.itemsPanel = document.createElement('div')
    this.itemsPanel.style.overflow = 'scroll'

    this.itemsPanel.style.display = 'flex'
    this.itemsPanel.style.flexDirection = 'row'
    this.itemsPanel.style.flexWrap = 'wrap'
    this.renderAssetList()
    this.guiPanel.appendChild(this.itemsPanel)
    
    this.actionsPanel = document.createElement('div')
    this.renderButtons()

    this.guiPanel.appendChild(this.actionsPanel)

    this.uiContainer.appendChild(this.guiPanel)
  }

  renderButtons() {
    this.actionsPanel.innerHTML = ''
    this.actionsPanel.appendChild(this.getModeButton('ground'))
    this.actionsPanel.appendChild(this.getModeButton('walls'))
    this.actionsPanel.appendChild(this.getModeButton('props'))
    this.actionsPanel.appendChild(this.getModeButton('events'))
  }

  renderAssetList() {
    this.itemsPanel.innerHTML = ''

    let entities: IEntity[] = []
    if (this.selectedMode === 'ground') {
      entities = this.grounds
    }

    entities.forEach(entity => {
      const entityBtn = document.createElement('button')
      entityBtn.style.width = '50px'
      entityBtn.style.height = '50px'

      // @ts-ignore
      entityBtn.style.background = entity?.color || '#FFF'
      entityBtn.style.cursor = 'pointer'

      const isSelected = entity.uuid === this.selectedEntity?.uuid
      if (isSelected) {
        entityBtn.style.opacity = '1'
      } else {
        entityBtn.style.opacity = '.25'
      }

      entityBtn.innerHTML = entity.name
      entityBtn.onclick = () => {
        this.selectedEntity = entity

        // Notify
        if (this.onEntityChange) {
          this.onEntityChange()
        }

        // Refresh GUI
        this.renderAssetList()
      }
      
      this.itemsPanel.appendChild(entityBtn)
    })
  }

  getModeButton(type: EntityType) {
    const label = type.toUpperCase()

    const btn = document.createElement('button')
    btn.innerHTML = label
    btn.style.cursor = 'pointer'
    const isActive = type === this.selectedMode
    if (isActive) {
      btn.style.background = 'white'
    } else {
      btn.style.background = 'grey'
    }

    btn.onclick = () => {
      this.selectedMode = type

      // Refresh GUI
      this.renderButtons()
      this.renderAssetList()
    }

    return btn
  }


}
