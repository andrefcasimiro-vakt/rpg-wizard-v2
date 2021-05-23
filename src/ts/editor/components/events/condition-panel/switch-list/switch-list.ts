import shortid = require("shortid");
import { Theme } from "src/ts/editor/config/theme";
import { getSwitches, setSwitches } from "src/ts/storage/switches";
import { ModalContext } from "../../../modal-context";
import { ConditionPanel } from "../condition-panel";

export class SwitchList {
  modalContext: ModalContext = new ModalContext()

  conditionPanel: ConditionPanel

  targetSwitchUuid: string

  // Html
  selectedSwitchUuid: string | null

  constructor(conditionPanel: ConditionPanel, targetSwitchUuid: string) {
    this.conditionPanel = conditionPanel

    this.targetSwitchUuid = targetSwitchUuid

    this.selectedSwitchUuid = this.targetSwitchUuid
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

    const selectedSwitchInput = document.createElement('div')
    selectedSwitchInput.style.display = 'flex'
    selectedSwitchInput.style.flexDirection = 'column'
    selectedSwitchInput.style.width = '100%'
    selectedSwitchInput.style.height = '300px'
    selectedSwitchInput.style.overflow = 'scroll'
    container.appendChild(selectedSwitchInput)


    const addSwitchBtn = document.createElement('button')
    addSwitchBtn.innerHTML = 'Add switch'
    addSwitchBtn.style.marginBottom = '10px'
    addSwitchBtn.style.width = '100px'
    addSwitchBtn.onclick = this.addSwitchToProject
    selectedSwitchInput.appendChild(addSwitchBtn)

    getSwitches().forEach(switchItem => {
      const btn = document.createElement('button')
      btn.innerHTML = switchItem.name
      btn.value = switchItem.uuid

      const isActive = switchItem.uuid == this.selectedSwitchUuid
      if (isActive) {
        btn.style.background = Theme.PRIMARY_DARK
        btn.style.color = Theme.DARK
      }

      btn.onclick = () => this.handleSelection(switchItem.uuid)

      selectedSwitchInput.appendChild(btn)
    })

    const actionsContainer = document.createElement('div')
    actionsContainer.style.display = 'flex'
    actionsContainer.style.flexDirection = 'column'
    container.appendChild(actionsContainer)


    const selectedSwitchNameLabel = document.createElement('label')
    selectedSwitchNameLabel.innerHTML = 'Switch name '
    selectedSwitchNameLabel.style.fontSize = '12px'
    selectedSwitchNameLabel.style.marginBottom = '4px'
    selectedSwitchNameLabel.htmlFor = 'switchName'
    actionsContainer.appendChild(selectedSwitchNameLabel)

    const selectedSwitchNameInput = document.createElement('input')
    selectedSwitchNameInput.id = 'switchName'
    selectedSwitchNameInput.style.padding = '6px'
    selectedSwitchNameInput.value = switches.find(x => x.uuid == this.selectedSwitchUuid)?.name || ''
    selectedSwitchNameInput.disabled = this.selectedSwitchUuid == null
    selectedSwitchNameInput.style.marginBottom = '4px'
    selectedSwitchNameInput.onchange = this.handleSwitchRename

    actionsContainer.appendChild(selectedSwitchNameInput)

    const selectSwitchBtn = document.createElement('button')
    selectSwitchBtn.innerHTML = 'Save changes'
    selectSwitchBtn.onclick = this.saveChanges
    selectSwitchBtn.disabled = this.selectedSwitchUuid == null
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
    this.conditionPanel.setSwitch(this.targetSwitchUuid, nextSwitch)

    this.modalContext.close()
  }

}
