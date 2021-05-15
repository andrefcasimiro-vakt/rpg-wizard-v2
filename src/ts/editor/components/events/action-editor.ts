import { Theme } from "../../config/theme";
import { EventActionTypes } from "../../enums/EventActionTypes";
import { ModalContext } from "../modal-context";
import { EventActionEditor } from "./actions/event-action-editor";
import { ShowMessages } from "./actions/messages/show-messages";
import { EventEditor } from "./event-editor";

const actions = {
  'Messages': {
    'Show Text...': ShowMessages,
    //'Show Choices': ShowMessages,
  },
  // 'Game Progression': {
  //   'Control Switches...': ShowMessages,
  // },
}

export class ActionEditor {

  eventEditor: EventEditor;
  modalContext: ModalContext = new ModalContext()

  constructor(eventEditor: EventEditor) {
    this.eventEditor = eventEditor
  }

  open = () => {
    this.modalContext.open(this.drawGui())
  }

  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Actions List'
    container.appendChild(title)


    const list = document.createElement('section')
    list.style.border = `1px solid ${Theme.DARK}`
    list.style.padding = '10px'
    container.appendChild(list)

    Object.entries(actions).forEach(action => {
      const sectionTitle = document.createElement('h3')
      sectionTitle.innerHTML = action[0]
      sectionTitle.style.display = 'flex'
      sectionTitle.style.flexDirection = 'column'
      list.appendChild(sectionTitle)

      Object.entries(action[1]).forEach(item => {
        const btn = document.createElement('button')
        btn.innerHTML = item[0]
        btn.style.cursor = 'pointer'
        btn.style.width = '100%'
        btn.onclick = () => this.dispatchAction(new item[1])
        list.appendChild(btn)
      })
    })

    return container
  }

  dispatchAction = (action: EventActionEditor) => {
    action.open()

    // Callback to update event editor whenever we submit or edit an action
    action.onChangesCommited = this.eventEditor.updateGui

    this.modalContext.close()
  }

}
