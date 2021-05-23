import shortid = require("shortid");
import { Theme } from "src/ts/editor/config/theme";
import { addOrUpdateEvent, getCurrentEventPageUuid, getEventByUuid, setCurrentEventPageUuid } from "src/ts/storage/events";
import { EventEditor } from "../event-editor";

export class PageToolbar {
  eventEditor: EventEditor

  constructor(eventEditor: EventEditor) {
    this.eventEditor = eventEditor
  }

  initialize = (container: HTMLElement) => {
    const event = this.eventEditor.getCurrentEvent()

    const pageToolbar = document.createElement('ul')
    pageToolbar.style.display = 'flex'
    pageToolbar.style.justifyContent = 'flex-end'
    pageToolbar.style.padding = '10px'
    pageToolbar.style.background = Theme.PRIMARY
    container.appendChild(pageToolbar)

    const addPageBtn = document.createElement('button')
    addPageBtn.style.marginRight = '10px'
    addPageBtn.innerHTML = 'Add Event Page'
    addPageBtn.onclick = this.addEventPage
    pageToolbar.appendChild(addPageBtn)

    const removePageBtn = document.createElement('button')
    removePageBtn.innerHTML = 'Remove this page'
    removePageBtn.disabled = event.eventPages.length <= 1
    removePageBtn.onclick = this.removeEventPage
    pageToolbar.appendChild(removePageBtn)

    // Pages 

    const pagePanel = document.createElement('ul')
    pagePanel.style.display = 'flex'
    pagePanel.style.paddingTop = '10px'
    container.appendChild(pagePanel)

    const currentEventPageUuid = getCurrentEventPageUuid()

    event.eventPages.forEach((eventPage, index) => {
      const isActive = eventPage.uuid === currentEventPageUuid

      const pageBtn = document.createElement('button')
      pageBtn.style.width = '100px'
      pageBtn.style.padding = '5px'
      pageBtn.innerHTML = `Page ${index}`
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
  }

  addEventPage = () => {
    const event = getEventByUuid(this.eventEditor.getEventUuid())

    event.eventPages.push({
      uuid: shortid.generate(),
      switches: [],
      actions: [],
    })

    addOrUpdateEvent(event)

    this.eventEditor.updateGui()
  }

  removeEventPage = () => {
    const event = getEventByUuid(this.eventEditor.getEventUuid())

    if (event.eventPages.length <= 1) {
      console.info('Cannot delete the first page of an event.')
      return
    }

    const newEventPages = event.eventPages.filter(x => x.uuid != getCurrentEventPageUuid())
    event.eventPages = newEventPages

    addOrUpdateEvent(event)

    setCurrentEventPageUuid(newEventPages[newEventPages.length - 1].uuid)

    this.eventEditor.updateGui()
  }

  handlePageChange = (uuid : string): void => {
    setCurrentEventPageUuid(uuid)

    this.eventEditor.updateGui()
  }

}
