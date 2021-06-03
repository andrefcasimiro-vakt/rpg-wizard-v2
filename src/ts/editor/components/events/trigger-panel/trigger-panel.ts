import { EventTrigger } from "src/ts/editor/enums/EventTrigger"
import { IEventPage } from "src/ts/editor/interfaces/IEventPage"
import { addOrUpdateEvent, getCurrentEventPageUuid } from "src/ts/storage/events"
import { EventEditor } from "../event-editor"
import * as styles from './trigger-panel.css'

export class TriggerPanel {
  page: IEventPage
  eventEditor: EventEditor

  constructor(page: IEventPage, eventEditor: EventEditor) {
    this.page = page
    this.eventEditor = eventEditor
  }

  initialize = (container: HTMLElement) => {
    const panel = document.createElement('div')
    panel.className = styles['panel']
    container.appendChild(panel)

    const headerText = document.createElement('h4')
    headerText.innerHTML = 'Trigger'
    panel.appendChild(headerText)

    //Create and append select list
    var selectList = document.createElement('select');
    container.appendChild(selectList)

    Object.values(EventTrigger).forEach(eventTrigger => {
      var option = document.createElement("option");
      option.value = eventTrigger
      option.label = eventTrigger
      selectList.appendChild(option);
    })

    selectList.onchange = (evt) => {
      // @ts-ignore
      this.updateEventPageTrigger(evt.target.value)
    }

    selectList.value = this.page.trigger
  }

  updateEventPageTrigger = (value: EventTrigger) => {
    const event = this.eventEditor.getCurrentEvent()
    const pageUuid = getCurrentEventPageUuid()

    const idx = event.eventPages.findIndex(x => x.uuid == pageUuid)
    event.eventPages[idx].trigger = value

    addOrUpdateEvent(event)
  }
}
