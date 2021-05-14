import shortid = require("shortid");
import { addOrUpdateEvent, getCurrentEventPageUuid, getEventByUuid, setCurrentEventPageUuid, setCurrentEventUuid } from "../../../storage/events";
import { Theme } from "../../config/theme";
import { IEvent } from "../../interfaces/IEvent";
import { Modal } from "../modal";
import { ActionEditor } from "./action-editor";

const HASH = '#event'

export class EventEditor {

  actionEditor: ActionEditor = new ActionEditor()

  event: IEvent

  constructor() {
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
    this.event = getEventByUuid(this.getEventUuid())
    
    setCurrentEventUuid(this.event.uuid)
    setCurrentEventPageUuid(this.event.eventPages[0].uuid)
  }

  updateGui = () => {
    Modal.close()
    Modal.open(this.getGui())
  }

  open = (eventUuid: string) => {
    window.location.hash = `${HASH}_${eventUuid}` 
  }

  getEventUuid = () => {
    return window.location.hash.replace(`${HASH}_`, '')
  }

  getGui = (): HTMLElement => {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'row'

    const sidebar = document.createElement('div')
    sidebar.style.display = 'flex'
    sidebar.style.width = '200px'
    sidebar.style.background = Theme.PRIMARY_DARK

    const content = document.createElement('div')
    content.style.display = 'flex'
    content.style.width = '100%'
    content.style.flexDirection = 'column'
    content.style.marginLeft = '10px'

    container.appendChild(sidebar)
    container.appendChild(content)    

    const title = document.createElement('h2')
    title.innerHTML = `Event ${this.getEventUuid()}`
    content.appendChild(title)

    // Page Toolbar
    const pageToolbar = document.createElement('ul')
    pageToolbar.style.display = 'flex'
    pageToolbar.style.justifyContent = 'flex-end'
    pageToolbar.style.padding = '10px'
    pageToolbar.style.background = Theme.PRIMARY
    content.appendChild(pageToolbar)

    const addPageBtn = document.createElement('button')
    addPageBtn.style.cursor = 'pointer'
    addPageBtn.style.marginRight = '10px'
    addPageBtn.innerHTML = 'Add Event Page'
    addPageBtn.onclick = this.addEventPage
    pageToolbar.appendChild(addPageBtn)

    const removePageBtn = document.createElement('button')
    removePageBtn.style.cursor = 'pointer'
    removePageBtn.innerHTML = 'Remove this page'
    removePageBtn.disabled = this.event.eventPages.length <= 1
    removePageBtn.onclick = this.removeEventPage
    pageToolbar.appendChild(removePageBtn)

    // Pages 

    const pagePanel = document.createElement('ul')
    pagePanel.style.display = 'flex'
    pagePanel.style.paddingTop = '10px'
    content.appendChild(pagePanel)

    const currentEventPageUuid = getCurrentEventPageUuid()
    this.event.eventPages.forEach((eventPage, index) => {
      const isActive = eventPage.uuid === currentEventPageUuid

      const pageBtn = document.createElement('button')
      pageBtn.style.width = '100px'
      pageBtn.style.padding = '5px'
      pageBtn.innerHTML = `Page ${index}`
      pageBtn.style.cursor = 'pointer'
      pageBtn.onclick = () => this.handlePageChange(eventPage.uuid)

      if (isActive) {
        pageBtn.style.background = Theme.LIGHT
        pageBtn.style.border = `1px solid ${Theme.PRIMARY}`
      } else {
        pageBtn.style.background = Theme.PRIMARY
        pageBtn.style.border = 'none'
      }

      pagePanel.appendChild(pageBtn)
    })
    

    const actionsPanel = document.createElement('ul')
    actionsPanel.style.display = 'flex'
    actionsPanel.style.background = Theme.LIGHT
    actionsPanel.style.border = `1px solid ${Theme.PRIMARY}`
    actionsPanel.style.height = '100%'
    actionsPanel.style.padding = '2px'
    actionsPanel.style.minHeight = '200px'
    actionsPanel.style.alignItems = 'flex-start'
    content.appendChild(actionsPanel)

    const addActionButton = document.createElement('button')
    addActionButton.innerHTML = '@ Add action'
    addActionButton.style.cursor = 'pointer'
    addActionButton.style.width = '100%'
    addActionButton.style.height = '20px'

    addActionButton.onclick = () => this.actionEditor.open()
    actionsPanel.appendChild(addActionButton)

    return container
  }

  addEventPage = () => {
    const event = this.event

    event.eventPages.push({
      uuid: shortid.generate(),
      pageIndex: event.eventPages.length,
      switchId: null,
      actions: [],
    })

    addOrUpdateEvent(event)

    this.updateGui()
  }

  removeEventPage = () => {
    if (this.event.eventPages.length <= 1) {
      console.info('Cannot delete the first page of an event.')
      return
    }

    const event = this.event

    const newEventPages = event.eventPages.filter(x => x.uuid != getCurrentEventPageUuid())
    event.eventPages = newEventPages

    addOrUpdateEvent(event)

    setCurrentEventPageUuid(newEventPages[newEventPages.length - 1].uuid)

    this.updateGui()
  }

  handlePageChange = (uuid : string): void => {
    setCurrentEventPageUuid(uuid)

    this.updateGui()
  }

}
