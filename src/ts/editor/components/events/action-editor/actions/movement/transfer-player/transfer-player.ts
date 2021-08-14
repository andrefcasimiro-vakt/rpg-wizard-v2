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

  open = () => {
    this.modalContext.open(this.drawGui())
  }

  update = (payload: IEventAction<TransferPlayerPayload>) => {
    this.currentValue = payload.payload
    this.actionUuid = payload.uuid

    this.modalContext.open(this.drawGui())
  }  

  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Transfer Player'
    container.appendChild(title)

    const content = createElement('div', styles.content)
    container.appendChild(content)

    const mapListContainer = createElement('div', styles.mapListContainer)
    content.appendChild(mapListContainer)

    const mapListComponent = new MapList(mapListContainer)
    const mapPreviewContainer = createElement('div', styles.mapPreviewContainer)
    content.appendChild(mapPreviewContainer)

    const mapTeleportEditor = new MapTeleportEditor(mapPreviewContainer, 300, 300)
    
    mapListComponent.onMapSelection = (mapUuid) => {
      const match = MapStorage.get()?.find(x => x.uuid === mapUuid)
      mapTeleportEditor.currentMap = match
      mapTeleportEditor.renderScene()
    }
    // const switchContainer = document.createElement('li')
    // switchContainer.style.display = 'flex'
    // switchContainer.style.alignItems = 'center'
    // switchContainer.style.justifyContent = 'space-between'
    // switchContainer.style.padding = '5px'
    // switchContainer.style.border = `1px solid ${Theme.PRIMARY_DARK}`
    // container.appendChild(switchContainer)

    // const switchNameAndSelectionContainer = document.createElement('div')
    // switchNameAndSelectionContainer.style.display = 'flex'
    // switchNameAndSelectionContainer.style.alignItems = 'center'
    // switchNameAndSelectionContainer.style.justifyContent = 'center'
    // switchContainer.appendChild(switchNameAndSelectionContainer)

    // const switchName = document.createElement('p')
    // switchName.style.fontSize = '12px'
    // switchName.innerHTML = this.selectedSwitch.name == null ? `Select a switch...` : `${this.selectedSwitch.name}`
    // switchNameAndSelectionContainer.appendChild(switchName)

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

  handleSwitchSelection = (nextSwitch: ISwitch) => {
    // this.selectedSwitch = nextSwitch
    // this.modalContext.refresh(this.drawGui())
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
