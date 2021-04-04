import * as shortid from 'shortid'
import { IEditor } from "src/ts/editor/interfaces/IEditor";
import { IMap } from "../interfaces/IMap";

export class MapEditor implements IEditor {
  
  public maps: IMap[] = [
    {
      uuid: '1',
      name: 'Mapa 1',
      layers: [],
    },
    {
      uuid: '2',
      name: 'Mapa 2',
      layers: [],
    },
    {
      uuid: '2',
      name: 'Mapa 2',
      layers: [],
      children: [
        {
          uuid: '2',
          name: 'Mapa 2',
          layers: [],
          children: [
            {
              uuid: '3',
              name: 'Mapa 3 sub leveled',
              layers: [],
            },
          ]
        },
        {
          uuid: '2',
          name: 'Mapa 2',
          layers: [],
        },
      ]
    },
  ];

  public currentMap: IMap

  // GUI
  public guiPanel: HTMLElement;
  public buttonsPanel: HTMLElement;

  public uiContainer: HTMLElement;

  constructor(uiContainer: HTMLElement) {
    this.uiContainer = uiContainer

    this.init();
  }

  init() {
    this.attachGui();
  }

  add() {
    this.maps.push(
      {
          uuid: shortid.generate(),
          name: `Map ${this.maps?.length + 1}`,
          layers: [],
        }
    )

    this.renderButtonListGui()
  }

  attachGui() {
    this.guiPanel = document.createElement('div')
    this.guiPanel.innerHTML = `<h2>Map list</h2>`
    this.guiPanel.style.width = `100%`
    this.guiPanel.style.padding = `10px`
    this.guiPanel.style.height = `100%`
    this.guiPanel.style.color = '#FFF'

    this.buttonsPanel = document.createElement('div')
    this.buttonsPanel.style.overflow = 'scroll'
    this.buttonsPanel.style.height = `300px`

    this.buttonsPanel.style.display = 'flex'
    this.buttonsPanel.style.flexDirection = 'column'
    this.guiPanel.appendChild(this.buttonsPanel)
    
    this.renderButtonListGui()

    const addButton = document.createElement('button')
    addButton.innerHTML = `Add map`
    addButton.onclick = () => this.add()
    this.guiPanel.appendChild(addButton)

    this.uiContainer.appendChild(this.guiPanel)
  }

  renderButtonListGui() {
    this.buttonsPanel.innerHTML = ''
    this.renderMapListGui(this.maps)
  }

  renderMapListGui(mapsToRender: IMap[] = [], level: number = 0) {    
    mapsToRender.forEach(map => {
      const button = document.createElement('button')

      button.innerHTML = map.name
      button.style.marginLeft = `${level * 20}px`
      button.style.minWidth = `200px`
      button.style.cursor = 'pointer'

      const isActive = map.uuid === this.currentMap?.uuid
      if (isActive) {
        button.style.background = 'white'
      } else {
        button.style.background = 'grey'
      }

      button.onclick = () => {
        this.currentMap = map

        // Refresh GUI
        this.renderButtonListGui()
      }

      this.buttonsPanel.appendChild(button)

      if (map.children?.length) {
        this.renderMapListGui(map.children, level + 1)
      }
    })
  }

  onSave() {

  }

  onLoad() {

  }
}
