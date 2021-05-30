import { DatabaseTabs } from "src/ts/editor/enums/database"
import { LoadIcon } from "src/ts/editor/icons/load-icon"
import { IActor } from "src/ts/editor/interfaces/IActor"
import { createElement } from "src/ts/editor/utils/ui"
import { DatabaseActorsStorage } from "src/ts/storage"
import { getResources } from "src/ts/storage/resources"
import { ResourceManager } from "../../resource-manager/resource-manager"
import { Database } from "../database"
import * as styles from './database-actors.css'

const HASH = DatabaseTabs.Actors

export class DatabaseActors extends Database {
  selectedActor: IActor = DatabaseActorsStorage.get()?.[0]

  constructor() {
    super('Actors', HASH)

    this.handleHashChange()
  }

  getChildren = () => {
    const content = createElement('div', styles.content) as HTMLDivElement

    const actorsList = this.getActorsList()
    content.appendChild(actorsList)

    const actorPanel = this.getActorsPanel()
    content.appendChild(actorPanel)

    return content
  }

  getActorsList = () => {
    const actorsListContainer = createElement('ul', styles.actorsListContainer)

    DatabaseActorsStorage.get().forEach(actor => {
      const actorItem = createElement('li', styles.actorItem)
      actorsListContainer.appendChild(actorItem)

      const btn = createElement('button', styles.actorButton) as HTMLButtonElement
      btn.innerHTML = actor.name

      if (actor.uuid == this.selectedActor.uuid) {
        btn.className = `${btn.className} ${styles.actorButtonActive}`
      }

      actorItem.appendChild(btn)

      btn.onclick = () => {
        this.selectedActor = actor

        this.update()
      }
    })

    return actorsListContainer
  }

  getActorsPanel = () => {
    const actorPanelContainer = createElement('div', styles.actorPanelContainer)

    const headerText = createElement('h4', '')
    headerText.innerHTML = this.selectedActor?.name
    actorPanelContainer.appendChild(headerText)

    const label = createElement('label', '') as HTMLLabelElement
    label.innerHTML = 'Graphic'
    label.htmlFor = 'actorGraphic'
    actorPanelContainer.appendChild(label)

    const graphicContainer = createElement('div', styles.field)
    actorPanelContainer.appendChild(graphicContainer)
    
    const input = createElement('input', '') as HTMLInputElement
    input.disabled = true

    const actorGraphic = getResources()?.characters?.find(x => x.uuid == this.selectedActor?.graphicUuid)
    input.value = actorGraphic?.displayName || '-'
    graphicContainer.appendChild(input)

    const selectResource = createElement('button', '') as HTMLButtonElement
    selectResource.onclick = () => {
      const resourceManager = new ResourceManager()

      resourceManager.onResourceSelection = (resource) => {

        const payload = {
          ...this.selectedActor,
          graphicUuid: resource.uuid,
        }
        DatabaseActorsStorage.update(payload)
        this.selectedActor = payload

        resourceManager.close()

        this.open()
      }

      resourceManager.open()
    }
    selectResource.innerHTML = LoadIcon(1.5)
    
    graphicContainer.appendChild(selectResource)

    return actorPanelContainer
  }

}
