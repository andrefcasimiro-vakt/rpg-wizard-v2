import shortid = require("shortid");
import { EntityLoader } from "src/ts/editor/components/entity-loader/entity-loader";
import { ModelViewer } from "src/ts/editor/components/model-viewer/model-viewer";
import { EntitiesStorage } from "src/ts/storage";
import { getResources } from "src/ts/storage/resources";
import { EntityType } from "../../enums/EntityType";
import { AddIcon } from "../../icons/add-icon";
import { IEntity } from "../../interfaces/IEntity";
import { IResource } from "../../interfaces/IResource";
import { createElement } from "../../utils/ui";
import { ContextMenu } from "../context-menu/context-menu";
import * as styles from './entity-editor.css'
import { EntitySettings } from "./entity-settings/entity-settings";

export class EntityEditor {

  onEntityChange: () => void;

  parent: HTMLElement
  container: HTMLElement

  entitySettings: EntitySettings = new EntitySettings()

  entityLoader: EntityLoader

  constructor(parent: HTMLElement, entityLoader: EntityLoader) {
    this.parent = parent

    this.entityLoader = entityLoader

    this.container = createElement('div', styles.container)
    this.parent.appendChild(this.container)

    this.drawGui()

    this.entitySettings.onChange = this.refresh

  }

  drawGui = () => {
    this.container.innerHTML = ''

    const guiHeader = createElement('div', styles.header)
    this.container.appendChild(guiHeader)

    const guiHeaderText = createElement('h3', styles.guiHeaderText)
    guiHeader.appendChild(guiHeaderText)
    guiHeaderText.innerHTML = 'Entities List'

    const addButton = createElement('button', styles.addButton)
    addButton.title = 'Add entity'

    guiHeader.appendChild(addButton)
    addButton.innerHTML = AddIcon
    addButton.onclick = this.addEntity

    const panel = createElement('div', styles.panel) as HTMLDivElement
    this.container.appendChild(panel)

    this.drawEntities(panel)
    this.drawTypeMenu(panel)
  }

  drawEntities = (parent: HTMLElement) => {
    const entitiesList = createElement('ul', styles.entitiesList)
    parent.appendChild(entitiesList)

    const entities = EntitiesStorage.get()
    const selectedMode = EntitiesStorage.getCurrentMode()
    const selectedEntity = EntitiesStorage.getCurrentEntity()

    const filteredEntities = entities?.filter(x => x.category == selectedMode)
    let resourceBank: IResource[]
    if (selectedMode == EntityType.Tiles) {
      resourceBank = getResources().textures
    } else if (selectedMode == EntityType.Props) {
      resourceBank = getResources().props
    }

    filteredEntities?.forEach(entity => {
      const entityBtn = createElement('button', styles.entityBtn) as HTMLButtonElement
      entitiesList.appendChild(entityBtn)

      entityBtn.addEventListener('contextmenu', e => {
        e.preventDefault()

        ContextMenu.open(
          entityBtn,
          e,
          {
            'Entity Settings': () => {
              this.entitySettings.open(entity.uuid)
            },
            'Remove Entity': () => {
              EntitiesStorage.remove(entity.uuid)

              this.refresh()
            },
          }
        )
      })


      const thumb = this.entityLoader.entityThumbnails?.[entity?.uuid]
      entityBtn.style.backgroundImage = `url(${thumb})`
      entityBtn.style.backgroundSize = 'cover'

      const isSelected = entity.uuid === selectedEntity?.uuid
      if (isSelected) {
        entityBtn.className = `${styles.entityBtn} ${styles.entityBtnActive}`
      }

      entityBtn.innerHTML = entity.name

      entityBtn.onclick = () => {
        this.handleEntitySelection(entity)
      }
    })
  }

  drawTypeMenu = (panel: HTMLDivElement) => {
    const activeType = EntitiesStorage.getCurrentMode()

    const menuContainer = createElement('ul', styles.menuContainer) as HTMLUListElement
    panel.appendChild(menuContainer)

    const tilesItem = createElement('li', styles.menuItem) as HTMLLIElement
    menuContainer.appendChild(tilesItem)
    const tilesButton = createElement('button', activeType === EntityType.Tiles ? styles.menuItemButtonActive : styles.menuItemButton)  as HTMLButtonElement
    tilesItem.appendChild(tilesButton)
    tilesButton.innerHTML = 'Tiles'
    tilesButton.onclick = () => {
      EntitiesStorage.setCurrentMode(EntityType.Tiles)
      this.refresh()
    }

    const propsItem = createElement('li', styles.menuItem) as HTMLLIElement
    menuContainer.appendChild(propsItem)
    const propsButton = createElement('button', activeType === EntityType.Props ? styles.menuItemButtonActive : styles.menuItemButton)  as HTMLButtonElement
    propsItem.appendChild(propsButton)
    propsButton.innerHTML = 'Props'
    propsButton.onclick = () => {
      EntitiesStorage.setCurrentMode(EntityType.Props)
      this.refresh()
    }
  }
  
  refresh = () => {
    this.drawGui()
  }

  handleEntitySelection = (entity: IEntity) => {
    EntitiesStorage.setCurrentEntity(entity.uuid)

    this.refresh()
  }

  addEntity = () => {
    EntitiesStorage.add({
      uuid: shortid.generate(),
      name: 'Entity',
      category: EntitiesStorage.getCurrentMode(),
      graphicUuid: '',
    })

    this.refresh()
  }

}
