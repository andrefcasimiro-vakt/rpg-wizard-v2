import shortid = require("shortid");
import { ISwitch } from "src/ts/editor/interfaces/ISwitch";
import { createElement } from "src/ts/editor/utils/ui";
import { getSwitches, setSwitches } from "src/ts/storage/switches";
import { ModalContext } from "../../../modal-context";
import * as styles from './switch-list.css'

export class SwitchList {
  modalContext: ModalContext = new ModalContext()

  onSwitchSelection: (nextSwitch: ISwitch) => void

  slotTargetSwitchUuid: string

  selectedSwitchUuid: string | null

  constructor(onSwitchSelection: (nextSwitch: ISwitch) => void, slotTargetSwitchUuid: string) {
    this.onSwitchSelection = onSwitchSelection

    this.slotTargetSwitchUuid = slotTargetSwitchUuid

    this.selectedSwitchUuid = this.slotTargetSwitchUuid
  }
  
  open = () => {
    this.modalContext.open(this.drawGui())
  }

  drawGui = () => {
    const container = document.createElement('div')
    const switches = getSwitches()

    const title = document.createElement('h2')
    title.innerHTML = 'Switches'
    container.appendChild(title)

    const switchListContainer = createElement('div', styles.switchListContainer)
    container.appendChild(switchListContainer)

    const addSwitchBtn = createElement('button', styles.addSwitchBtn)
    addSwitchBtn.innerHTML = 'Add switch'
    addSwitchBtn.onclick = this.addSwitchToProject
    switchListContainer.appendChild(addSwitchBtn)

    getSwitches().forEach(switchItem => {
      const switchItemBtn = createElement('button', styles.switchItemBtn) as HTMLButtonElement
      switchItemBtn.innerHTML = switchItem.name
      switchItemBtn.value = switchItem.uuid

      const isActive = switchItem.uuid == this.selectedSwitchUuid
      if (isActive) {
        switchItemBtn.className = `${styles.switchItemBtn} ${styles.switchItemBtnActive}`
      }

      switchItemBtn.onclick = () => this.handleSelection(switchItem.uuid)
      switchListContainer.appendChild(switchItemBtn)
    })

    const actionsContainer = createElement('div', styles.actionsContainer)
    container.appendChild(actionsContainer)

    const selectedSwitchNameLabel = createElement('label', styles.selectedSwitchNameLabel) as HTMLLabelElement
    selectedSwitchNameLabel.innerHTML = 'Switch name '
    selectedSwitchNameLabel.htmlFor = 'switchName'
    actionsContainer.appendChild(selectedSwitchNameLabel)

    const isDisabled = switches.length <= 0 || !switches?.find(x => x.uuid == this.selectedSwitchUuid)

    const selectedSwitchNameInput = createElement('input', styles.selectedSwitchNameInput) as HTMLInputElement
    selectedSwitchNameInput.id = 'switchName'
    selectedSwitchNameInput.value = switches.find(x => x.uuid == this.selectedSwitchUuid)?.name || ''
    selectedSwitchNameInput.disabled = isDisabled
    selectedSwitchNameInput.onchange = this.handleSwitchRename

    actionsContainer.appendChild(selectedSwitchNameInput)

    const selectSwitchBtn = document.createElement('button')
    selectSwitchBtn.innerHTML = 'Save changes'
    selectSwitchBtn.onclick = this.saveChanges
    selectSwitchBtn.disabled = isDisabled
    actionsContainer.appendChild(selectSwitchBtn)

    return container
  }

  addSwitchToProject = () => {
    const switches = getSwitches()
    switches.push({
      uuid: shortid.generate(),
      name: `Switch ${switches.length + 1}`,
      value: false,
    })

    setSwitches(switches)

    this.modalContext.refresh(this.drawGui())
  }

  handleSelection = (switchUuid: string) => {
    this.selectedSwitchUuid = switchUuid

    this.modalContext.refresh(this.drawGui())
  }

  handleSwitchRename = (evt) => {
    const switches = getSwitches()
    const idx = switches.findIndex(x => x.uuid === this.selectedSwitchUuid)

    switches[idx].name = evt.target.value

    setSwitches(switches)
    this.modalContext.refresh(this.drawGui())
  }

  saveChanges = () => {
    const nextSwitch = getSwitches().find(x => x.uuid === this.selectedSwitchUuid)

    // Callback
    this.onSwitchSelection(nextSwitch)

    this.modalContext.close()
  }
}
