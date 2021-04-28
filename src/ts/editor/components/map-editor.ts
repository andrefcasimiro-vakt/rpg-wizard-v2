import * as shortid from 'shortid'
import { IEditor } from "src/ts/editor/interfaces/IEditor";
import { CURRENT_MAP_UUID_STORAGE_KEY, getCurrentMapUuid, getMaps, MAP_LIST_STORAGE_KEY, setCurrentMapUuid, setMaps } from '../../storage/maps';
import { Theme } from '../config/theme';
import { AddIcon } from '../icons/add-icon';
import { SubArrowIcon } from '../icons/sub-arrow-icon';
import { IMap } from "../interfaces/IMap";
import { createActionButtonGUI, createActionPanelGUI, createListPanelGUI } from '../utils/ui';

const MAP_LIST_HEIGHT = 220

// shortid.generate() can create ids that start with numbers, which make querySelector by id invalid
// https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
const generateMapId = () =>  `map-${shortid.generate()}`
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
    this.renderMapListGui(getMaps())
  }

  renderMapListGui = (mapsToRender: IMap[] = []) => {   
    const currentMapUuid = getCurrentMapUuid() 

    mapsToRender.forEach(map => {
      const isActive = map.uuid === currentMapUuid

      const handleClick = () => {
        this.save()

        setCurrentMapUuid(map.uuid)

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
    const updatedMaps = getMaps().slice()

    updatedMaps.push(
      {
          uuid: generateMapId(),
          name: `Map ${updatedMaps?.length + 1}`,
          layers: [],
        }
    )

    setMaps(updatedMaps)

    const nextCurrentMapUuid = updatedMaps[updatedMaps.length - 1]?.uuid
    setCurrentMapUuid(nextCurrentMapUuid)

    // Update GUI
    this.refreshButtonListGui()
    this.scrollToItemGUI(nextCurrentMapUuid)

    // On add map, set that new map as the current one
    setCurrentMapUuid(updatedMaps[updatedMaps.length - 1].uuid)
  }

  scrollToItemGUI = (uuid: string) => {
    if (!uuid) {
      uuid = getMaps()?.[0]?.uuid
    }

    // Scroll to last map on the list
    const targetElement = this.mapListPanel.querySelector(`#${uuid}`)
    targetElement.scrollIntoView()
  }

  updateMap = (uuid: string, payload: Partial<IMap>) => {
    const maps = getMaps()
    
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
    const maps = getMaps()

    for (const map of maps) {
      let hasFound = false

      for (const layer of map.layers) {
        if (layer?.startingPosition != null) {
          layer.startingPosition = null
          hasFound = true
          break
        }
      }

      if (hasFound) {
        break;
      }
    }

    setMaps(maps)
  }

  // This has become useless now that we are syncing with storage all the time
  // In the future when we have json export we use Editor.ts to handle the json generation of the whole project
  save = () => {    
    const mapListPayload = JSON.stringify(getMaps())
    window.localStorage.setItem(MAP_LIST_STORAGE_KEY, mapListPayload)

    const currentMapPayload = JSON.stringify(getCurrentMapUuid())
    window.localStorage.setItem(CURRENT_MAP_UUID_STORAGE_KEY, currentMapPayload)
  }

  load = () => {
    this.scrollToItemGUI(getCurrentMapUuid())
  }
}
