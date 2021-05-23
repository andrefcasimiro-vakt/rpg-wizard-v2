import { getEventByUuid, setCurrentEventPageUuid, setCurrentEventUuid } from "../../../storage/events";
import { IEvent } from "../../interfaces/IEvent";
import { Modal } from "../modal";
import { ActionEditor } from "./action-editor/action-editor";
import { EventPage } from "./event-page/event-page";
import { PageToolbar } from "./page-toolbar/page-toolbar";

const HASH = '#event'

export class EventEditor {

  actionEditor: ActionEditor

  constructor() {
    this.actionEditor = new ActionEditor(this)

    window.addEventListener('hashchange', () => {
      this.drawGui()
    })

    // Need to call at the beginning as well
    this.drawGui()
  }

  drawGui = () => {
    if (window.location.hash.includes(HASH)) {
      this.setupEvent()

      Modal.open(this.getGui())
    }
  }

  setupEvent = () => {
    // Retrieve the event from storage
    const event = getEventByUuid(this.getEventUuid())
    
    setCurrentEventUuid(event.uuid)
    setCurrentEventPageUuid(event.eventPages[0].uuid)
  }

  updateGui = () => {
    Modal.refresh(this.getGui())
  }

  open = (eventUuid: string) => {
    window.location.hash = `${HASH}_${eventUuid}` 
  }

  getEventUuid = () => {
    return window.location.hash.replace(`${HASH}_`, '')
  }

  getCurrentEvent = (): IEvent => {
    return getEventByUuid(this.getEventUuid())
  }

  getGui = (): HTMLElement => {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'row'

    const content = document.createElement('div')
    content.style.display = 'flex'
    content.style.width = '100%'
    content.style.flexDirection = 'column'
    content.style.marginLeft = '10px'

    container.appendChild(content)    

    const title = document.createElement('h2')
    title.innerHTML = `Event ${this.getEventUuid()}`
    content.appendChild(title)

    // Page Toolbar
    new PageToolbar(this).initialize(content)
    new EventPage(this).initialize(content)

    return container
  }
}
