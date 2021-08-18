import shortid = require('shortid')
import { MapIcon } from 'src/ts/editor/icons/map-icon'
import { createElement } from 'src/ts/editor/utils/ui'
import { MapStorage } from 'src/ts/storage'

import * as styles from './map-list.css'

/**
 * A generic component to list the maps of the project
 */
export class MapList {
  container: HTMLElement
  mapListContainer: HTMLElement
  editingMapNameUuid: string

  onMapSelection: (mapUuid: string) => void;

  prefixUuid = `map${shortid.generate()}`

  selectedMapUuid: string
  
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

    const guiHeaderText = createElement('h4', styles.guiHeaderText)
    guiHeader.appendChild(guiHeaderText)
    guiHeaderText.innerHTML = 'Map List'

    this.renderMapList(guiPanel)
  }

  renderMapList = (container) => {
    const mapList = createElement('ul', styles.mapList)
    container.appendChild(mapList)
    
    MapStorage.get()?.forEach(map => {
      const mapItem = createElement('li', styles.mapItem)
      mapItem.id = `${this.prefixUuid}-${map.uuid}`

      // Render map button
      const mapButton = createElement('button', styles.mapButton) as HTMLButtonElement
      mapItem.append(mapButton)
      mapButton.innerHTML = `${MapIcon(1)} ${map.name}`

      mapButton.onclick = () => {
        this.selectMap(map.uuid)
      }
      
      if (this.selectedMapUuid == map.uuid) {
        mapButton.className = `${styles.mapButton} ${styles.mapButtonActive}`
      }

      if (map?.parentUuid) {
        const parent = mapList.querySelector(`#${this.prefixUuid}-${map.parentUuid}`) as HTMLElement
      
        mapItem.style.marginLeft = '20px'
        parent?.appendChild(mapItem)

      } else {
        mapList.appendChild(mapItem)
      }
    })
  }

  selectMap = (mapUuid) => {
    this.selectedMapUuid = mapUuid

    if (this.onMapSelection) {
      this.onMapSelection(mapUuid)
    }

    this.refresh()
  }
}
