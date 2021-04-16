import * as shortid from 'shortid'
import { IEditor } from "src/ts/editor/interfaces/IEditor";
import { Theme } from '../config/theme';
import { AddIcon } from '../icons/add-icon';
import { SubArrowIcon } from '../icons/sub-arrow-icon';
import { IMap } from "../interfaces/IMap";
import { createActionButtonGUI, createActionPanelGUI, createListPanelGUI } from '../utils/ui';

export const CURRENT_MAP_UUID_STORAGE_KEY = `currentMapUuid`
export const MAP_LIST_STORAGE_KEY = `maps`

const MAP_LIST_HEIGHT = 220

// shortid.generate() can create ids that start with numbers, which make querySelector by id invalid
// https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
const generateMapId = () =>  `map-${shortid.generate()}`

const map2 = generateMapId()
const map3 = generateMapId()
export const defaultMaps: IMap[] = [
  {
    uuid: generateMapId(),
    name: 'Mapa 1',
    layers: [],
  },
  {
    uuid: map2,
    name: 'Mapa 2',
    layers: [],
  },
  {
    uuid: generateMapId(),
    name: 'Mapa 2 - Sub',
    layers: [],
    parentUuid: map2,
  },
  {
    uuid: generateMapId(),
    name: 'Mapa 3-1',
    layers: [],
  },
  {
    uuid: map3,
    name: 'Map3',
    layers: [],
    parentUuid: map2,
  },
  {
    uuid: generateMapId(),
    name: 'Sub Map of Map3',
    layers: [],
    parentUuid: map3,
  },
];
export class MapEditor implements IEditor {

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
    this.mapListPanel.style.flexFlow = 'column'
    this.mapListPanel.style.flexDirection = 'column'
    this.mapListPanel.style.height ='100%'

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
    this.renderMapListGui(this.getMaps())
  }

  renderMapListGui = (mapsToRender: IMap[] = []) => {   
    const currentMapUuid = this.getCurrentMapUuid() 

    mapsToRender.forEach(map => {
      const isActive = map.uuid === currentMapUuid

      const handleClick = () => {
        this.save()

        this.setCurrentMapUuid(map.uuid)

        if (this.onMapSelection) {
          this.onMapSelection();
        }
        
        // Redraw GUI
        this.refreshButtonListGui()
      }

      const mapItem = document.createElement('li')
      mapItem.style.display = 'flex'
      mapItem.style.flexDirection = 'column'

      const btn = document.createElement('button')
      btn.innerHTML = `${map?.parentUuid ? SubArrowIcon : ''}${map.name}`
      btn.id = map.uuid
      btn.onclick = handleClick

      const btnStyle = btn.style
      btnStyle.minWidth = '100%'
      btnStyle.cursor = 'pointer'
      btnStyle.display = 'flex'
      btnStyle.flexDirection = 'row'
      btnStyle.justifyContent = 'flex-start'
      btnStyle.position = 'relative'
      btnStyle.alignItems = 'center'
      btnStyle.paddingLeft = `20px`
      btnStyle.height = `30px`
      btnStyle.border = `1px solid ${isActive ? Theme.PRIMARY_DARK : Theme.NEUTRAL_DARKER}`
      btnStyle.background = isActive ? Theme.PRIMARY : Theme.LIGHT

      mapItem.appendChild(btn)

      if (map?.parentUuid) {
        // Get margin of parent element and add 20 px
        const parent = this.mapListPanel.querySelector(`#${map.parentUuid}`) as HTMLButtonElement
        const offset = Number(parent.style.marginLeft.replace('px', '')) + 20
        const thisMapItemBtn = mapItem.childNodes[0] as HTMLButtonElement
        thisMapItemBtn.style.marginLeft = `${offset}px`
        parent.parentElement.appendChild(mapItem)
      } else {
        this.mapListPanel.appendChild(mapItem)
      }
    })
  }

  addMap = () => {
    const updatedMaps = this.getMaps().slice()

    updatedMaps.push(
      {
          uuid: generateMapId(),
          name: `Map ${updatedMaps?.length + 1}`,
          layers: [],
        }
    )

    this.setMaps(updatedMaps)

    const nextCurrentMapUuid = updatedMaps[updatedMaps.length - 1]?.uuid
    this.setCurrentMapUuid(nextCurrentMapUuid)

    // Update GUI
    this.refreshButtonListGui()
    this.scrollToItemGUI(nextCurrentMapUuid)

    // On add map, set that new map as the current one
    this.setCurrentMapUuid(updatedMaps[updatedMaps.length - 1].uuid)
  }

  scrollToItemGUI = (uuid: string) => {
    if (!uuid) {
      uuid = this.getMaps()?.[0]?.uuid
    }

    // Scroll to last map on the list
    const targetElement = this.mapListPanel.querySelector(`#${uuid}`)
    targetElement.scrollIntoView()
  }

  // Getters

  getMaps = (): IMap[] => {
    return JSON.parse(window.localStorage.getItem(MAP_LIST_STORAGE_KEY)) || defaultMaps
  }

  getCurrentMap = (): IMap => {
    return this.getMaps().find(map => map.uuid === this.getCurrentMapUuid())
  }

  getCurrentMapUuid = (): string => {
    return window.localStorage.getItem(CURRENT_MAP_UUID_STORAGE_KEY) || ''
  }

  // Setters

  setCurrentMapUuid = (uuid: string) => {
    window.localStorage.setItem(CURRENT_MAP_UUID_STORAGE_KEY, uuid)
  }

  setMaps = (maps: IMap[]) => {
    window.localStorage.setItem(MAP_LIST_STORAGE_KEY, JSON.stringify(maps))
  }

  updateMap = (uuid: string, payload: Partial<IMap>) => {
    const maps = this.getMaps()
    
    for (const map of maps) {
      if (map.uuid === uuid) {
        const index = maps.indexOf(map)

        maps[index] = {
          ...maps[index],
          ...payload,
        }

        break
      }
    }

    window.localStorage.setItem(MAP_LIST_STORAGE_KEY, JSON.stringify(maps))
  }

  clearStartingPosition = () => {
    const maps = this.getMaps()

    for (const map of maps) {
      let hasFound = false

      for (const layer of map.layers) {
        if (layer?.startingPosition != null) {
          layer.startingPosition = null
        }
      }

      if (hasFound) {
        break;
      }
    }

    this.setMaps(maps)
  }

  // This has become useless now that we are syncing with storage all the time
  // In the future when we have json export we use Editor.ts to handle the json generation of the whole project
  save = () => {    
    const mapListPayload = JSON.stringify(this.getMaps())
    window.localStorage.setItem(MAP_LIST_STORAGE_KEY, mapListPayload)

    const currentMapPayload = JSON.stringify(this.getCurrentMapUuid())
    window.localStorage.setItem(CURRENT_MAP_UUID_STORAGE_KEY, currentMapPayload)
  }

  load = () => {
    this.scrollToItemGUI(this.getCurrentMapUuid())
  }
}
