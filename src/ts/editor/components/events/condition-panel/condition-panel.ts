import shortid = require("shortid");
import { Theme } from "src/ts/editor/config/theme";
import { IEventPage } from "src/ts/editor/interfaces/IEventPage";
import { ISwitch } from "src/ts/editor/interfaces/ISwitch";
import { addOrUpdateEvent, getCurrentEvent } from "src/ts/storage/events";
import { getSwitches } from "src/ts/storage/switches";
import { EventEditor } from "../event-editor";
import { SwitchList } from "./switch-list/switch-list";

export class ConditionPanel {
  page: IEventPage
  eventEditor: EventEditor

  constructor(page: IEventPage, eventEditor: EventEditor) {
    this.page = page
    this.eventEditor = eventEditor
  }

  initialize = (container: HTMLElement) => {
    const conditionsPanel = document.createElement('div')
    conditionsPanel.style.width = '30%'
    conditionsPanel.style.height = '100%'
    conditionsPanel.style.padding = '10px'

    container.appendChild(conditionsPanel)
    
    // Switches
    const switchPanel = document.createElement('div')
    switchPanel.style.width = '100%'
    switchPanel.style.display = 'flex'
    switchPanel.style.flexDirection = 'column'
    conditionsPanel.appendChild(switchPanel)

    const switchHeaderText = document.createElement('h4')
    switchHeaderText.innerHTML = 'Conditions'
    switchPanel.appendChild(switchHeaderText)

    const switchesList = document.createElement('ul')
    switchesList.style.display = 'flex'
    switchesList.style.flexDirection = 'column'
    switchPanel.appendChild(switchesList)

    this.page.switches.forEach(switchItem => {
      const switchContainer = document.createElement('li')
      switchContainer.style.display = 'flex'
      switchContainer.style.alignItems = 'center'
      switchContainer.style.justifyContent = 'space-between'
      switchContainer.style.padding = '5px'
      switchContainer.style.border = `1px solid ${Theme.PRIMARY_DARK}`
      switchesList.appendChild(switchContainer)

      const switchName = document.createElement('p')
      switchName.style.fontSize = '12px'
      switchName.innerHTML = switchItem.name == null ? `Select a switch...` : `${switchItem.name} is ON`
      switchContainer.appendChild(switchName)

      const buttonContainers = document.createElement('div')
      switchContainer.appendChild(buttonContainers)

      const switchListButton = document.createElement('button')
      switchListButton.innerHTML = '...'
      switchListButton.title = 'Select a switch from the list'
      switchListButton.onclick = () => {
        new SwitchList(
          (nextSwitch) => this.setSwitch(switchItem.uuid, nextSwitch),
          switchItem.uuid
        ).open()
      }

      buttonContainers.appendChild(switchListButton)

      const switchRemoveButton = document.createElement('button')
      switchRemoveButton.onclick = () => this.removeSwitch(switchItem.uuid)
      switchRemoveButton.style.marginLeft = '5px'
      switchRemoveButton.title = 'Remove this switch'
      switchRemoveButton.innerHTML = 'X'
      buttonContainers.appendChild(switchRemoveButton)
    })

    const addSwitchButton = document.createElement('button')
    addSwitchButton.innerHTML = 'Add switch'
    addSwitchButton.style.display = 'flex'
    addSwitchButton.style.width = '100%'
    addSwitchButton.style.marginTop = `10px`
    addSwitchButton.onclick = this.addSwitch
    
    switchesList.appendChild(addSwitchButton)
  }

  addSwitch = () => {
    const currentEvent = getCurrentEvent()

    currentEvent.eventPages.forEach((page, index) => {
      if (page.uuid == this.page.uuid) {
        const entry = currentEvent.eventPages[index]
        const placeholderSwitch = {
          uuid: shortid.generate(),
          name: null,
          value: null,
        }

        currentEvent.eventPages[index] = {
          ...entry,
          switches: entry.switches.length > 0
            ? entry.switches.concat(placeholderSwitch)
            : [placeholderSwitch]
        }

        addOrUpdateEvent(currentEvent)
        this.eventEditor.updateGui()
        return
      }
    })
  }

  removeSwitch = (switchUuid: string) => {
    const currentEvent = getCurrentEvent()

    currentEvent.eventPages.forEach((page, index) => {
      if (page.uuid == this.page.uuid) {
        currentEvent.eventPages[index] = {
          ...currentEvent.eventPages[index],
          switches: currentEvent.eventPages[index].switches.filter(x => x.uuid !== switchUuid)
        }

        addOrUpdateEvent(currentEvent)
        this.eventEditor.updateGui()
        return
      }
    })
  }

  setSwitch = (targetSwitchUuid: string, nextSwitch: ISwitch) => {
    const currentEvent = getCurrentEvent()

    currentEvent.eventPages.forEach((page, index) => {
      if (page.uuid == this.page.uuid) {
        const entry = currentEvent.eventPages[index]

        for (let i = 0; i < entry.switches.length; i++) {
          if (entry.switches[i].uuid === targetSwitchUuid) {
            entry.switches[i] = nextSwitch
            break
          }
        }

        currentEvent.eventPages[index] = {
          ...entry,
          switches: entry.switches,
        }

        addOrUpdateEvent(currentEvent)
        this.eventEditor.updateGui()
        return
      }
    })
  }
}
