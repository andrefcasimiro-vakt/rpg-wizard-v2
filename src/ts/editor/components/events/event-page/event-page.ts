import { Theme } from "src/ts/editor/config/theme"
import { getEventActionInstance } from "src/ts/editor/utils/event-actions"
import { getCurrentEventPageUuid } from "src/ts/storage/events"
import { ConditionPanel } from "../condition-panel/condition-panel"
import { EventEditor } from "../event-editor"

export class EventPage {
  eventEditor: EventEditor

  constructor(eventEditor: EventEditor) {
    this.eventEditor = eventEditor
  }

  initialize = (container: HTMLElement) => {
    const pageContent = document.createElement('div')
    pageContent.style.display = 'flex'
    pageContent.style.flexDirection = 'row'
    pageContent.style.background = Theme.PRIMARY
    pageContent.style.border = `1px solid ${Theme.PRIMARY}`
    container.appendChild(pageContent)

    const currentEvent = this.eventEditor.getCurrentEvent()
    const currentPageUuid = getCurrentEventPageUuid()
    const page = currentEvent.eventPages.find(eventPage => eventPage.uuid == currentPageUuid)

    // Page Conditions Panel
    new ConditionPanel(page, this.eventEditor).initialize(pageContent)

    const actionsPanel = document.createElement('div')
    actionsPanel.style.display = 'flex'
    actionsPanel.style.flexDirection = 'column'
    actionsPanel.style.padding = '10px'
    actionsPanel.style.width = '100%'
    actionsPanel.style.height = '100%'
    actionsPanel.style.height = 'calc(100vh - 300px)'
    actionsPanel.style.overflowY = 'scroll'

    actionsPanel.style.alignItems = 'flex-start'
    pageContent.appendChild(actionsPanel)

    page.actions.forEach(action => {
      const btn = document.createElement('button')
      btn.innerHTML = action.display
      btn.style.width = '100%'
      btn.style.border = 'none'
      btn.style.display = 'flex'
      btn.style.flexDirection = 'column'
      btn.style.backgroundColor = Theme.PRIMARY_LIGHT
      btn.style.borderLeft = `2px solid ${Theme.PRIMARY_DARK}`
      btn.style.paddingLeft = `10px`
      btn.style.margin = `10px 0`

      const handler = getEventActionInstance(action.type)
      handler.onChangesCommited = this.eventEditor.updateGui

      btn.ondblclick = () => handler.update(action)
      
      actionsPanel.appendChild(btn)
    })

    const addActionButton = document.createElement('button')
    addActionButton.innerHTML = '@ Add action'
    addActionButton.style.width = '100%'
    addActionButton.style.height = '20px'

    addActionButton.onclick = () => this.eventEditor.actionEditor.open()
    actionsPanel.appendChild(addActionButton)
  }
}
