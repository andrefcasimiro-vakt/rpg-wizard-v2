import shortid = require("shortid");
import { EventActionTypes } from "../../../../../enums/EventActionTypes";
import { IEventAction } from "../../../../../interfaces/IEventAction";
import { ModalContext } from "../../../../modal-context";
import { EventActionEditor } from "../event-action-editor";
import { getActionLabel } from "../../../../../utils/ui";
import { ISwitch } from "src/ts/editor/interfaces/ISwitch";
import { SwitchList } from "../../../condition-panel/switch-list/switch-list";
import { Theme } from "src/ts/editor/config/theme";

export interface ControlSwitchPayload {
  switch: ISwitch
  nextValue: boolean
}

export class ControlSwitches extends EventActionEditor {
  selectedSwitch: ISwitch = {
    uuid: null,
    name: null,
    value: null,
  }

  modalContext: ModalContext = new ModalContext()

  switchList: SwitchList

  actionUuid = shortid.generate()

  currentValue: boolean

  open = () => {
    this.modalContext.open(this.drawGui())
  }

  update = (payload: IEventAction<ControlSwitchPayload>) => {
    this.selectedSwitch = payload.payload.switch
    this.currentValue = payload.payload.nextValue
    this.actionUuid = payload.uuid

    this.modalContext.open(this.drawGui())
  }  

  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Control Switch'
    container.appendChild(title)

    const switchContainer = document.createElement('li')
    switchContainer.style.display = 'flex'
    switchContainer.style.alignItems = 'center'
    switchContainer.style.justifyContent = 'space-between'
    switchContainer.style.padding = '5px'
    switchContainer.style.border = `1px solid ${Theme.PRIMARY_DARK}`
    container.appendChild(switchContainer)

    const switchNameAndSelectionContainer = document.createElement('div')
    switchNameAndSelectionContainer.style.display = 'flex'
    switchNameAndSelectionContainer.style.alignItems = 'center'
    switchNameAndSelectionContainer.style.justifyContent = 'center'
    switchContainer.appendChild(switchNameAndSelectionContainer)

    const switchName = document.createElement('p')
    switchName.style.fontSize = '12px'
    switchName.innerHTML = this.selectedSwitch.name == null ? `Select a switch...` : `${this.selectedSwitch.name}`
    switchNameAndSelectionContainer.appendChild(switchName)

    const switchListButton = document.createElement('button')
    switchListButton.innerHTML = '...'
    switchListButton.style.display = 'flex'
    switchListButton.style.marginLeft = '5px'
    switchListButton.title = 'Select a switch from the list'
    switchListButton.onclick = () => {
      new SwitchList(this.handleSwitchSelection, this.selectedSwitch.uuid).open()
    }
    switchNameAndSelectionContainer.appendChild(switchListButton)

    const buttonContainers = document.createElement('div')
    switchContainer.appendChild(buttonContainers)
    
    // Input
    const inputs = ['On', 'Off']
    inputs.forEach(input => {
      var btn = document.createElement('button')
      btn.innerHTML = `Switch ${input}`
      btn.disabled = this.selectedSwitch.uuid == null

      if (input == 'On' && this.currentValue) {
        btn.style.background = Theme.PRIMARY
      }

      if (input == 'Off' && this.currentValue == false) {
        btn.style.background = Theme.PRIMARY
      }

      btn.onclick = () => {
        if (input == 'On') {
          this.currentValue = true
        } else {
          this.currentValue = false
        }

        this.modalContext.refresh(this.drawGui())
      }

      buttonContainers.appendChild(btn)
    })

    const submitBtn = document.createElement('button')
    submitBtn.innerHTML = 'Save changes'
    submitBtn.style.marginTop = '10px'
    submitBtn.onclick = this.save
    container.appendChild(submitBtn)
    submitBtn.disabled = this.currentValue == null

    return container
  }

  handleSwitchSelection = (nextSwitch: ISwitch) => {
    this.selectedSwitch = nextSwitch
    this.modalContext.refresh(this.drawGui())
  }

  save = () => {
    const display = `
      ${getActionLabel('@set_switch:')}
      <p><b>${this.selectedSwitch.uuid} - ${this.selectedSwitch.name}:</b></p>
      <p>set value to <b>${this.currentValue}</b></p>
    `

    const eventAction: IEventAction<ControlSwitchPayload> = {
      uuid: this.actionUuid,
      type: EventActionTypes.CONTROL_SWITCHES,
      payload: {
        switch: this.selectedSwitch,
        nextValue: this.currentValue,
      },
      display,
    }

    this.onCommitChanges(eventAction)

    this.modalContext.close()
  }
}
