import shortid = require("shortid");
import { Theme } from "src/ts/editor/config/theme";
import { IEventPage } from "src/ts/editor/interfaces/IEventPage";
import { ISwitch } from "src/ts/editor/interfaces/ISwitch";
import { addOrUpdateEvent, getCurrentEvent } from "src/ts/storage/events";
import { EventEditor } from "../event-editor";
import { SwitchList } from "./switch-list/switch-list";
import * as styles from './condition-panel.css'
import { createElement, createElementWithTooltip } from "src/ts/editor/utils/ui";

export class ConditionPanel {
  page: IEventPage
  eventEditor: EventEditor

  constructor(page: IEventPage, eventEditor: EventEditor) {
    this.page = page
    this.eventEditor = eventEditor
  }

  initialize = (container: HTMLElement) => {    
    // Switches
    const switchPanel = createElement('div', styles.switchPanel)
    container.appendChild(switchPanel)

    const switchHeaderText = document.createElement('h4')
    switchHeaderText.innerHTML = 'Conditions'
    switchPanel.appendChild(switchHeaderText)

    const switchesList = createElement('ul', styles.switchList)
    switchPanel.appendChild(switchesList)

    this.page.switches.forEach(switchItem => {
      const switchContainer = createElement('li', styles.switchContainer)
      switchesList.appendChild(switchContainer)

      const switchName = createElement('p', styles.switchName)
      switchName.innerHTML = switchItem.name == null ? `Select a switch...` : `<em>${switchItem.name}</em> <strong>is ON</strong>`
      switchContainer.appendChild(switchName)

      const switchManagementButtons = createElement('div', styles.switchManagementButtons)
      switchContainer.appendChild(switchManagementButtons)

      const switchListButton = document.createElement('button')
      switchListButton.innerHTML = '...'
      switchListButton.onclick = () => {
        new SwitchList(
          (nextSwitch) => this.setSwitch(switchItem.uuid, nextSwitch),
          switchItem.uuid
        ).open()
      }
      switchManagementButtons.appendChild(
        createElementWithTooltip(switchListButton, 'Select a switch from the list')
      )

      const switchRemoveButton = document.createElement('button')
      switchRemoveButton.className = styles.switchRemoveButton
      switchRemoveButton.onclick = () => this.removeSwitch(switchItem.uuid)
      switchRemoveButton.innerHTML = 'X'
      switchManagementButtons.appendChild(
        createElementWithTooltip(switchRemoveButton, 'Remove switch')
      )
    })

    const addSwitchButton = createElement('button', styles.addSwitchButton)
    addSwitchButton.innerHTML = 'Add switch'
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
