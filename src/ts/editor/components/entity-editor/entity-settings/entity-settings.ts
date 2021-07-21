import { EntityType } from "src/ts/editor/enums/EntityType";
import { LoadIcon } from "src/ts/editor/icons/load-icon";
import { IEntity } from "src/ts/editor/interfaces/IEntity";
import { createElement } from "src/ts/editor/utils/ui";
import { EntitiesStorage } from "src/ts/storage";
import { getResources } from "src/ts/storage/resources";
import { Modal } from "../../modal";
import { ResourceManager, resourcePaths } from "../../resource-manager/resource-manager";
import * as styles from './entity-settings.css'

const HASH = 'entity-settings'

export class EntitySettings {

  container: HTMLElement

  onChange: () => void;

  constructor() {
    window.addEventListener('hashchange', () => {
      this.handleHashChange()
    })

    // Need to call at the beginning as well
    this.handleHashChange()
  }


  handleHashChange = () => {
    if (window.location.hash.includes(HASH)) {
      const entityUuid = window.location.hash.split('=')?.reverse()?.[0]
      const entity = EntitiesStorage.get().find(x => x.uuid == entityUuid)

      if (entity) {
        Modal.open(this.getGui(entity))
      }
    }
  }

  update = (entity: IEntity) => {
    Modal.open(this.getGui(entity))
  }

  getGui = (entity: IEntity) => {
    const container = createElement('div', '')

    const title = createElement('h3', '')
    container.appendChild(title)
    title.innerHTML = entity.name


    const settings = this.getEntitySettings(entity)
    container.appendChild(settings)


    const graphicsPanel = this.getEntityGraphicsPanel(entity)
    container.appendChild(graphicsPanel)

    return container
  }

  getEntitySettings = (entity: IEntity) => {
    const entitySettingsPanel = createElement('div', styles.entityPanelContainer)

    const label = createElement('label', '') as HTMLLabelElement
    label.innerHTML = 'Entity Name'
    label.htmlFor = 'entityNameInput'
    entitySettingsPanel.appendChild(label)

    const input = createElement('input', '') as HTMLInputElement
    input.value = entity.name
    input.type = 'text'
    input.id = 'entityNameInput'
    input.onchange = (evt) => {
      // @ts-ignore
      const name = evt.target.value

      const payload = {
        ...entity,
        name,
      }

      EntitiesStorage.update(payload)

      this.onChange()
    }

    entitySettingsPanel.appendChild(input)

    return entitySettingsPanel
  }

  getEntityGraphicsPanel = (entity: IEntity) => {
    const entityPanelContainer = createElement('div', styles.entityPanelContainer)

    const label = createElement('label', '') as HTMLLabelElement
    label.innerHTML = 'Resource'
    label.htmlFor = 'entityResource'
    entityPanelContainer.appendChild(label)

    const graphicContainer = createElement('div', styles.field)
    entityPanelContainer.appendChild(graphicContainer)
    
    const input = createElement('input', '') as HTMLInputElement
    input.disabled = true

    const resourceFolder = entity.category === EntityType.Props ? 'props' : 'textures'
    const graphic = getResources()?.[resourceFolder]?.find(x => x.uuid == entity.graphicUuid)

    input.value = graphic?.displayName || '-'
    graphicContainer.appendChild(input)

    const selectedResource = createElement('button', '') as HTMLButtonElement
    selectedResource.onclick = () => {
      const resourceManager = new ResourceManager()
      resourceManager.allowedFolder = resourcePaths.props

      resourceManager.onResourceSelection = (resource) => {

        const payload = {
          ...entity,
          graphicUuid: resource.uuid,
        }

        EntitiesStorage.update(payload)

        resourceManager.close()

        this.open(entity.uuid)
      }

      resourceManager.open(resourcePaths.props)
    }
    selectedResource.innerHTML = LoadIcon(1.5)
    
    graphicContainer.appendChild(selectedResource)

    return entityPanelContainer
  }

  open = (entityUuid: string) => {
    window.location.hash = `${HASH}&uuid=${entityUuid}`
  }

}
