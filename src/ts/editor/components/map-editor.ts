import * as shortid from 'shortid'
import { IEditor } from "src/ts/editor/interfaces/IEditor";
import { Theme } from '../config/theme';
import { AddIcon } from '../icons/add-icon';
import { SubArrowIcon } from '../icons/sub-arrow-icon';
import { IGround, IMap } from "../interfaces/IMap";
import { createActionButtonGUI, createActionPanelGUI, createListPanelGUI } from '../utils/ui';

export const CURRENT_MAP_STORAGE_KEY = `currentMap`
export const MAP_LIST_STORAGE_KEY = `maps`

const MAP_LIST_HEIGHT = 220

// shortid.generate() can create ids that start with numbers, which make querySelector by id invalid
// https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
const generateMapId = () =>  `map-${shortid.generate()}`

export const defaultMaps = [
  {
    uuid: generateMapId(),
    name: 'Mapa 1',
    layers: [],
  },
  {
    uuid: generateMapId(),
    name: 'Mapa 2',
    layers: [],
  },
  {
    uuid: generateMapId(),
    name: 'Mapa 2',
    layers: [],
    children: [
      {
        uuid: generateMapId(),
        name: 'Mapa 2',
        layers: [],
        children: [
          {
            uuid: generateMapId(),
            name: 'Mapa 3 sub leveled',
            layers: [],
          },
        ]
      },
      {
        uuid: generateMapId(),
        name: 'Mapa 2',
        layers: [],
      },
    ]
  },
];
export class MapEditor implements IEditor {
  
  // Map List
  private _maps: IMap[]
  
  public get maps() {
    return this._maps
  }

  public set maps(value: IMap[]) {
    this._maps = value

    // Redraw GUI
    this.refreshButtonListGui()

    this.scrollToItemGUI(value[value.length - 1].uuid)
  }

  // Current Map
  private _currentMap: IMap
  
  public get currentMap() {
    return this._currentMap
  }

  public set currentMap(value: IMap) {
    this._currentMap = value

    // Notify
    this.onMapSelection()

    // Redraw GUI
    this.refreshButtonListGui()
  }

  // GUI
  public uiContainer: HTMLElement;
  public guiPanel: HTMLElement;
  public mapListPanel: HTMLElement;
  public actionPanel: HTMLElement;

  // Events
  public onMapSelection: () => void;

  constructor(uiContainer: HTMLElement) {
    window.onload = this.load

    this.uiContainer = uiContainer

    this.drawGui();
  }

  drawGui = () => {
    this.guiPanel = document.createElement('div')
    this.guiPanel.innerHTML = `<h3>Map List</h3>`
    const guiPanelStyle = this.guiPanel.style
    guiPanelStyle.width = `100%`
    guiPanelStyle.height = `100%`
    guiPanelStyle.color = Theme.DARK
    guiPanelStyle.marginBottom = `10px`

    this.mapListPanel = createListPanelGUI(MAP_LIST_HEIGHT)
    this.guiPanel.appendChild(this.mapListPanel)
    
    this.refreshButtonListGui()

    this.actionPanel = createActionPanelGUI()
    const addButton = createActionButtonGUI(`${AddIcon} Add Map`)
    addButton.onclick = this.addMap
    this.actionPanel.appendChild(addButton)

    this.guiPanel.appendChild(this.actionPanel)
    this.uiContainer.appendChild(this.guiPanel)
  }

  refreshButtonListGui = () => {
    this.mapListPanel.innerHTML = ''
    this.renderMapListGui(this.maps)
  }

  renderMapListGui = (mapsToRender: IMap[] = [], level: number = 0) => {    
    mapsToRender.forEach(map => {
      const mapItemBtn = document.createElement('button')
      mapItemBtn.innerHTML = `${level > 0 ? SubArrowIcon : ''}${map.name}`
      mapItemBtn.id = map.uuid

      const mapItemBtnStyle = mapItemBtn.style
      mapItemBtnStyle.marginLeft = `${level * 20}px`
      mapItemBtnStyle.minWidth = '100%'
      mapItemBtnStyle.cursor = 'pointer'
      mapItemBtnStyle.display = 'flex'
      mapItemBtnStyle.justifyContent = 'flex-start'
      mapItemBtnStyle.alignItems = 'center'
      mapItemBtnStyle.paddingLeft = `20px`
      mapItemBtnStyle.height = `30px`
      const isActive = map.uuid === this.currentMap?.uuid
      mapItemBtnStyle.border = `1px solid ${isActive ? Theme.PRIMARY_DARK : Theme.NEUTRAL_DARKER}`
      mapItemBtnStyle.background = isActive ? Theme.PRIMARY : Theme.LIGHT

      mapItemBtn.onclick = () => { this.currentMap = map }

      this.mapListPanel.appendChild(mapItemBtn)

      if (map.children?.length) {
        this.renderMapListGui(map.children, level + 1)
      }
    })
  }

  addMap = () => {
    const updatedMaps = this.maps.slice()

    updatedMaps.push(
      {
          uuid: generateMapId(),
          name: `Map ${this.maps?.length + 1}`,
          layers: [],
        }
    )

    this.maps = updatedMaps

    // On add map, set that new map as the current one
    this.currentMap = this.maps[this.maps.length - 1]
  }

  paintMap = (ground: IGround) => {
    if (!this.currentMap.layers?.length) {
      this.currentMap.layers = [{ grounds: [] }]
    }

    const index = this.currentMap.layers?.[0]?.grounds.indexOf(ground)

    if (index !== -1) {
      this.currentMap.layers[0].grounds[index] = ground
    } else {
      this.currentMap.layers[0].grounds.push(ground)
    }
  }

  commitCurrentMapChanges = () => {
    this.findMapByUuid(this.currentMap.uuid, (map) => {
      map = this.currentMap
    })
  }

  findMapByUuid = (uuid: string, callback: (foundMap: IMap) => void, maps = this.maps) => {
    for (const map of maps) {
      if (map.uuid === uuid) {
        callback(map)
        break
      }

      if (map.children?.length) {
        this.findMapByUuid(uuid, callback, map.children)
      }
    }
  }

  scrollToItemGUI = (uuid: string) => {
    // Scroll to last map on the list
    const targetElement = this.mapListPanel.querySelector(`#${uuid}`)
    targetElement.scrollIntoView()
  }

  public save = () => {
    const mapList = JSON.stringify(this.maps)
    window.localStorage.setItem(MAP_LIST_STORAGE_KEY, mapList)

    const currentMap = JSON.stringify(this.currentMap)
    window.localStorage.setItem(CURRENT_MAP_STORAGE_KEY, currentMap)
  }

  public load = () => {
    const storageMaps = window.localStorage.getItem(MAP_LIST_STORAGE_KEY)
    const maps: IMap[] = JSON.parse(storageMaps) || defaultMaps
    this.maps = maps

    const storageCurrentMap = window.localStorage.getItem(CURRENT_MAP_STORAGE_KEY)
    const currentMap: IMap = JSON.parse(storageCurrentMap) || maps?.[0]
    this.currentMap = currentMap

    if (this.currentMap) {
      this.scrollToItemGUI(currentMap.uuid)
    }
  }
}
