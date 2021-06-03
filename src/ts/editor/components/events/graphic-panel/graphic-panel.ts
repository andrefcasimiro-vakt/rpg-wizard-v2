import { EventTrigger } from "src/ts/editor/enums/EventTrigger"
import { LoadIcon } from "src/ts/editor/icons/load-icon"
import { IEventPage } from "src/ts/editor/interfaces/IEventPage"
import { createElement } from "src/ts/editor/utils/ui"
import { addOrUpdateEvent, getCurrentEventPageUuid } from "src/ts/storage/events"
import { getResources } from "src/ts/storage/resources"
import { ResourceManager } from "../../resource-manager/resource-manager"
import { EventEditor } from "../event-editor"
import * as styles from './graphic-panel.css'

export class GraphicPanel {
  eventEditor: EventEditor

  constructor(eventEditor: EventEditor) {
    this.eventEditor = eventEditor
  }

  initialize = (container: HTMLElement) => {
    const event = this.eventEditor.getCurrentEvent()
    const pageUuid = getCurrentEventPageUuid()
    const page = event.eventPages.find(x => x.uuid == pageUuid)

    const panel = document.createElement('div')
    panel.className = styles['panel']
    container.appendChild(panel)

    const headerText = document.createElement('h4')
    headerText.innerHTML = 'Graphic'
    panel.appendChild(headerText)


    const graphicContainer = createElement('div', styles.field)
    panel.appendChild(graphicContainer)
    
    const input = createElement('input', '') as HTMLInputElement
    input.disabled = true

    const eventGraphic = getResources()?.characters?.find(x => x.uuid == page?.graphicUuid)
    input.value = eventGraphic?.displayName || '-'
    graphicContainer.appendChild(input)

    const selectResource = createElement('button', '') as HTMLButtonElement
    graphicContainer.appendChild(selectResource)

    const currentEventUuid = this.eventEditor.getEventUuid()
    
    selectResource.onclick = () => {
      const resourceManager = new ResourceManager()

      resourceManager.onResourceSelection = (resource) => {
        const idx = event.eventPages.findIndex(x => x.uuid == pageUuid)
        event.eventPages[idx].graphicUuid = resource.uuid

        addOrUpdateEvent(event)

        resourceManager.close()

        this.eventEditor.open(currentEventUuid)
      }

      resourceManager.open()
    }
    selectResource.innerHTML = LoadIcon(1.5)
    
  }
}
