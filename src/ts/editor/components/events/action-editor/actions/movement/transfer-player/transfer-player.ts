import shortid = require("shortid");
import { ISwitch } from "src/ts/editor/interfaces/ISwitch";
import * as styles from './transfer-player.css'
import { Vector3 } from "three";
import { createElement } from "src/ts/editor/utils/ui";
import { EventActionEditor } from "src/ts/editor/components/events/action-editor/actions/event-action-editor";
import { ModalContext } from "src/ts/editor/components/modal-context";
import { IEventAction } from "src/ts/editor/interfaces/IEventAction";
import { MapList } from "src/ts/editor/components/common/map-list/map-list";
import { MapVisualizer } from "src/ts/editor/components/common/map-visualizer/map-visualizer";
import { MapTeleportEditor } from "src/ts/editor/components/common/map-teleport-editor/map-teleport-editor";
import { MapStorage } from "src/ts/storage";

export interface TransferPlayerPayload {
  mapUuid: string
  spawnPosition: Vector3
}

export class TransferPlayer extends EventActionEditor {
  modalContext: ModalContext = new ModalContext()

  actionUuid = shortid.generate()

  currentValue: TransferPlayerPayload

  mapList: MapList
  mapTeleportEditor: MapTeleportEditor

  mapListContainer: HTMLElement
  mapPreviewContainer: HTMLElement

  selectionDetailsContainer: HTMLElement

  open = () => {
    // Init references
    this.mapListContainer = createElement('div', styles.mapListContainer)
    this.mapPreviewContainer = createElement('div', styles.mapPreviewContainer)

    this.mapList =  new MapList(this.mapListContainer)
    this.mapTeleportEditor = new MapTeleportEditor(this.mapPreviewContainer, 300, 300)

    this.modalContext.open(this.drawGui())
  }

  update = (payload: IEventAction<TransferPlayerPayload>) => {
    this.currentValue = payload.payload
    this.actionUuid = payload.uuid

    this.modalContext.open(this.drawGui())
  }  


  setEvent = (payload: TransferPlayerPayload) => {
    this.currentValue = payload
  }  

  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Transfer Player'
    container.appendChild(title)

    const content = createElement('div', styles.content)
    container.appendChild(content)

    content.appendChild(this.mapListContainer)
    content.appendChild(this.mapPreviewContainer)

    this.mapTeleportEditor.onIntersectionCompleted = (mapUuidToTeleport, spawnPosition) => {
      this.setEvent({ mapUuid: mapUuidToTeleport, spawnPosition })

      this.mapTeleportEditor.renderScene()

      this.refreshSelectionDetails()
    }

    if (this.currentValue?.mapUuid) {
      const currentMap = MapStorage.get()?.find(x => x.uuid === this.currentValue.mapUuid)
      if (currentMap) this.mapTeleportEditor.currentMap = currentMap
    }
    if (this.currentValue?.spawnPosition) {
      this.mapTeleportEditor.positionToTeleport = this.currentValue.spawnPosition
    }

    this.mapList.onMapSelection = (mapUuid) => {
      const match = MapStorage.get()?.find(x => x?.uuid === mapUuid)
      this.mapTeleportEditor.currentMap = match
      this.mapTeleportEditor.renderScene()
    }

    const helpTextContainer = createElement('div', styles.helpTextContainer)
    this.mapPreviewContainer.appendChild(helpTextContainer)
    const helpText = createElement('p', styles.helpText)
    helpTextContainer.appendChild(helpText)
    helpText.innerHTML = 'Press "SHIFT" on the tile you wish to transfer the player'

    this.selectionDetailsContainer = createElement('div', '')
    this.mapPreviewContainer.appendChild(this.selectionDetailsContainer)
    this.refreshSelectionDetails()

    // const switchListButton = document.createElement('button')
    // switchListButton.innerHTML = '...'
    // switchListButton.style.display = 'flex'
    // switchListButton.style.marginLeft = '5px'
    // switchListButton.title = 'Select a switch from the list'
    // switchListButton.onclick = () => {
    //   new SwitchList(this.handleSwitchSelection, this.selectedSwitch.uuid).open()
    // }
    // switchNameAndSelectionContainer.appendChild(switchListButton)

    // const buttonContainers = document.createElement('div')
    // switchContainer.appendChild(buttonContainers)
    
    // // Input
    // const inputs = ['On', 'Off']
    // inputs.forEach(input => {
    //   var btn = document.createElement('button')
    //   btn.innerHTML = `Switch ${input}`
    //   btn.disabled = this.selectedSwitch.uuid == null

    //   if (input == 'On' && this.currentValue) {
    //     btn.style.background = Theme.PRIMARY
    //   }

    //   if (input == 'Off' && this.currentValue == false) {
    //     btn.style.background = Theme.PRIMARY
    //   }

    //   btn.onclick = () => {
    //     if (input == 'On') {
    //       this.currentValue = true
    //     } else {
    //       this.currentValue = false
    //     }

    //     this.modalContext.refresh(this.drawGui())
    //   }

    //   buttonContainers.appendChild(btn)
    // })

    // const submitBtn = document.createElement('button')
    // submitBtn.innerHTML = 'Save changes'
    // submitBtn.style.marginTop = '10px'
    // submitBtn.onclick = this.save
    // container.appendChild(submitBtn)
    // submitBtn.disabled = this.currentValue == null

    // return container

    return container
  }

  refreshSelectionDetails = () => {
    this.selectionDetailsContainer.innerHTML = ''
    const labelsContainer = createElement('div', styles.labelsContainer)
    this.selectionDetailsContainer.appendChild(labelsContainer)

    const labelHeaderText = createElement('h4', styles.labelHeaderText)
    labelHeaderText.innerHTML = 'Transfer Player Information'
    labelsContainer.appendChild(labelHeaderText)

    const currentMapName = MapStorage.get()?.find(x => x?.uuid === this.currentValue?.mapUuid)?.name || '-'
    const selectedMapLabel = createElement('p', styles.selectedMapLabel)
    selectedMapLabel.innerHTML = `Map to teleport: ${currentMapName}`
    labelsContainer.appendChild(selectedMapLabel)

    const selectedCoordinatesLabel = createElement('p', styles.selectedCoordinatesLabel)
    if (this.currentValue?.spawnPosition) {
      const { x, y, z } = this.currentValue?.spawnPosition
      selectedCoordinatesLabel.innerHTML = `Position to teleport: (${x}, ${y}, ${z})`
    } else {
      selectedCoordinatesLabel.innerHTML = `Position to teleport: -`
    }
    labelsContainer.appendChild(selectedCoordinatesLabel)
  }

  save = () => {
    // const display = `
    //   ${getActionLabel('@set_switch:')}
    //   <p><b>${this.selectedSwitch.uuid} - ${this.selectedSwitch.name}:</b></p>
    //   <p>set value to <b>${this.currentValue}</b></p>
    // `

    // const eventAction: IEventAction<ControlSwitchPayload> = {
    //   uuid: this.actionUuid,
    //   type: EventActionTypes.CONTROL_SWITCHES,
    //   payload: {
    //     switch: this.selectedSwitch,
    //     nextValue: this.currentValue,
    //   },
    //   display,
    // }

    // this.onCommitChanges(eventAction)

    // this.modalContext.close()
  }
}
