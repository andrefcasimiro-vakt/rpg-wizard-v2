import shortid = require('shortid')
import { MapStorage } from 'src/ts/storage'
import { AddIcon } from '../../icons/add-icon'
import { MapIcon } from '../../icons/map-icon'
import { createElement, createListPanelGUI } from '../../utils/ui'
import { ContextMenu } from '../context-menu/context-menu'
import * as styles from './map-list-editor.css'

export class MapListEditor {
  container: HTMLElement

  mapListContainer: HTMLElement

  editingMapNameUuid: string

  onMapSelected: () => void;
  
  constructor(container: HTMLElement) {
    this.container = container

    this.mapListContainer = createElement('div', styles.mapListContainer)
    this.container.appendChild(this.mapListContainer)

    this.drawGui()
  }

  refresh = () => {
    this.drawGui()
  }

  drawGui = () => {
    this.mapListContainer.innerHTML = ''

    const guiPanel = createElement('div', styles.guiPanel)
    this.mapListContainer.appendChild(guiPanel)

    const guiHeader = createElement('div', styles.header)
    guiPanel.appendChild(guiHeader)

    const guiHeaderText = createElement('h3', styles.guiHeaderText)
    guiHeader.appendChild(guiHeaderText)
    guiHeaderText.innerHTML = 'Map List'

    const addButton = createElement('button', styles.addButton)
    addButton.title = 'Add map'

    guiHeader.appendChild(addButton)
    addButton.innerHTML = AddIcon
    addButton.onclick = this.addMap

    this.renderMapList(guiPanel)
  }

  renderMapList = (container) => {
    const mapList = createElement('ul', styles.mapList)
    container.appendChild(mapList)
    
    const currentMapUuid = MapStorage.getCurrentMap()?.uuid
    MapStorage.get()?.forEach(map => {
      const mapItem = createElement('li', styles.mapItem)
      mapItem.id = `map-${map.uuid}`

      // Render name input
      if (this.editingMapNameUuid == map.uuid) {
        const mapNameInput = createElement('input', '') as HTMLInputElement
        mapNameInput.style.display = 'flex'
        mapNameInput.value = map.name
        mapNameInput.onchange = (event) => {
          MapStorage.update({
            ...map, // @ts-ignore
            name: event.target.value,
          })
          this.editingMapNameUuid = null
          this.refresh()
        }
        mapItem.appendChild(mapNameInput)
      } else {
        // Render map button
        const mapButton = createElement('button', styles.mapButton) as HTMLButtonElement
        mapItem.append(mapButton)
        mapButton.innerHTML = `${MapIcon(1)} ${map.name}`

        mapButton.onclick = () => {
          this.selectMap(map.uuid)
        }

        mapButton.ondblclick = () => {
          this.editingMapNameUuid = map.uuid
          this.refresh()
        }

        mapButton.addEventListener('contextmenu', e => {
          e.preventDefault()

          this.selectMap(map.uuid)

          ContextMenu.open(
            mapItem,
            e,
            {
              'Map Settings': () => {},
              'Remove Map': () => this.removeMap(map.uuid),
            }
          )
        })

        if (currentMapUuid == map.uuid) {
          mapButton.className = `${styles.mapButton} ${styles.mapButtonActive}`
        }
      }

      if (map?.parentUuid) {
        const parent = mapList.querySelector(`#map-${map.parentUuid}`) as HTMLElement
      
        mapItem.style.marginLeft = '20px'
        parent.appendChild(mapItem)

      } else {
        mapList.appendChild(mapItem)
      }
    })
  }

  selectMap = (mapUuid) => {
    MapStorage.setCurrentMap(mapUuid)

    if (this.onMapSelected) {
      this.onMapSelected()
    }

    this.refresh()
  }

  addMap = () => {
    MapStorage.add({
      uuid: shortid.generate(),
      name: 'Untitled map',
      grounds: [],
      events: [],
      settings: {
        width: 20,
        depth: 20,
        skyboxColor: '#FFF',
        ambientLightColor: '#FFF',
      },
      parentUuid: MapStorage.getCurrentMap()?.uuid,
    })

    this.refresh()
  }

  removeMap = (mapUuid: string) => {
    MapStorage.remove(mapUuid)

    

    this.refresh()
  }


}
