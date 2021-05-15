import shortid = require("shortid");
import { addOrUpdateEvent, getCurrentEventPageUuid, getEventByUuid, setCurrentEventPageUuid, setCurrentEventUuid } from "../../../storage/events";
import { Theme } from "../../config/theme";
import { IEvent } from "../../interfaces/IEvent";
import { Modal } from "../modal";
import { ActionEditor } from "./action-editor";

const HASH = '#event'

export class EventEditor {

  actionEditor: ActionEditor = new ActionEditor()

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

  getGui = (): HTMLElement => {
    const event = getEventByUuid(this.getEventUuid())

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
    removePageBtn.disabled = event.eventPages.length <= 1
    removePageBtn.onclick = this.removeEventPage
    pageToolbar.appendChild(removePageBtn)

    // Pages 

    const pagePanel = document.createElement('ul')
    pagePanel.style.display = 'flex'
    pagePanel.style.paddingTop = '10px'
    content.appendChild(pagePanel)


    const currentEventPageUuid = getCurrentEventPageUuid()

    event.eventPages.forEach((eventPage, index) => {
      const isActive = eventPage.uuid === currentEventPageUuid

      const pageBtn = document.createElement('button')
      pageBtn.style.width = '100px'
      pageBtn.style.padding = '5px'
      pageBtn.innerHTML = `Page ${index}`
      pageBtn.style.cursor = 'pointer'
      pageBtn.onclick = () => this.handlePageChange(eventPage.uuid)

      if (isActive) {
        pageBtn.style.background = Theme.PRIMARY
        pageBtn.style.color = Theme.DARK
        pageBtn.style.border = 'none'
      } else {
        pageBtn.style.background = Theme.LIGHT
        pageBtn.style.color = Theme.DARK
        pageBtn.style.border = `1px solid ${Theme.PRIMARY}`
      }

      pagePanel.appendChild(pageBtn)
    })
    

    const actionsPanel = document.createElement('ul')
    actionsPanel.style.display = 'flex'
    actionsPanel.style.flexDirection = 'column'
    actionsPanel.style.background = Theme.PRIMARY
    actionsPanel.style.border = `1px solid ${Theme.PRIMARY}`
    actionsPanel.style.height = '100%'
    actionsPanel.style.padding = '10px'
    actionsPanel.style.minHeight = '200px'
    actionsPanel.style.alignItems = 'flex-start'
    content.appendChild(actionsPanel)

    const page = event.eventPages.find(eventPage => eventPage.uuid == currentEventPageUuid)
    page.actions.forEach(action => {
      const btn = document.createElement('btn')
      btn.innerHTML = action.display
      btn.onclick = () => console.log(action)
      btn.style.cursor = 'pointer'
      btn.style.width = '100%'
      btn.style.borderLeft = `2px solid ${Theme.PRIMARY_DARK}`
      btn.style.paddingLeft = `10px`
      btn.style.margin = `10px 0`
      
      actionsPanel.appendChild(btn)
    })

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
    const event = getEventByUuid(this.getEventUuid())

    event.eventPages.push({
      uuid: shortid.generate(),
      switchId: null,
      actions: [],
    })

    addOrUpdateEvent(event)

    this.updateGui()
  }

  removeEventPage = () => {
    const event = getEventByUuid(this.getEventUuid())

    if (event.eventPages.length <= 1) {
      console.info('Cannot delete the first page of an event.')
      return
    }

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
