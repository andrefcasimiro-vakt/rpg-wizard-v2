import shortid = require("shortid");
import { EntitiesStorage } from "src/ts/storage";
import { getResources } from "src/ts/storage/resources";
import { EntityType } from "../../enums/EntityType";
import { AddIcon } from "../../icons/add-icon";
import { IEntity } from "../../interfaces/IEntity";
import { IResource } from "../../interfaces/IResource";
import { createElement } from "../../utils/ui";
import * as styles from './entity-editor.css'

export class EntityEditor {

  onEntityChange: () => void;

  parent: HTMLElement
  container: HTMLElement

  constructor(parent: HTMLElement) {
    this.parent = parent

    this.container = createElement('div', styles.container)
    this.parent.appendChild(this.container)

    this.drawGui()
  }

  // GUI
  drawGui = () => {
    this.container.innerHTML = ''

    const guiHeader = createElement('div', styles.header)
    this.container.appendChild(guiHeader)

    const guiHeaderText = createElement('h3', styles.guiHeaderText)
    guiHeader.appendChild(guiHeaderText)
    guiHeaderText.innerHTML = 'Entities List'

    const addButton = createElement('button', styles.addButton)
    addButton.title = 'Add map'

    guiHeader.appendChild(addButton)
    addButton.innerHTML = AddIcon
    addButton.onclick = this.addEntity

    const panel = createElement('div', styles.panel)
    this.container.appendChild(panel)

    this.drawEntities(panel)
  }

  drawEntities = (parent: HTMLElement) => {
    const entitiesList = createElement('ul', styles.entitiesList)
    parent.appendChild(entitiesList)

    const entities = EntitiesStorage.get()
    const selectedMode = EntitiesStorage.getCurrentMode()
    const selectedEntity = EntitiesStorage.getCurrentEntity()

    const filteredEntities = entities?.filter(x => x.category == selectedMode)
    let resourceBank: IResource[]
    if (selectedMode == EntityType.Ground) {
      resourceBank = getResources().textures
    } else if (selectedMode == EntityType.Props) {
      resourceBank = getResources().props
    }

    filteredEntities?.forEach(entity => {
      const entityBtn = createElement('button', styles.entityBtn) as HTMLButtonElement
      entitiesList.appendChild(entityBtn)

      const resource = resourceBank?.find(x => x.uuid == entity.graphicUuid) as IResource
      entityBtn.style.backgroundImage = `url(${resource?.downloadUrl})`

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
