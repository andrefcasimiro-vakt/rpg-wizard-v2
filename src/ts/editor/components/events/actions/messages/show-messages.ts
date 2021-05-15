import shortid = require("shortid");
import { EventActionTypes } from "../../../../../editor/enums/EventActionTypes";
import { IEventAction } from "../../../../../editor/interfaces/IEventAction";
import { ModalContext } from "../../../modal-context";
import { EventActionEditor } from "../event-action-editor";
import { getActionLabel } from "../../../../../editor/utils/ui";

export interface ShowMessagePayload {
  actorName: string;
  message: string;
}

export class ShowMessages extends EventActionEditor {
  actorNameInput: HTMLInputElement
  messageInput: HTMLTextAreaElement

  modalContext: ModalContext = new ModalContext()

  actionUuid = shortid.generate()

  open = () => {
    this.modalContext.open(this.drawGui())
  }

  update = (payload: IEventAction<ShowMessagePayload>) => {
    this.modalContext.open(this.drawGui())

    this.actionUuid = payload.uuid
    this.actorNameInput.value = payload.payload.actorName
    this.messageInput.value = payload.payload.message
  }  

  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Show Message'
    container.appendChild(title)

    this.actorNameInput = document.createElement('input')
    this.actorNameInput.placeholder = 'Actor name'
    this.actorNameInput.style.marginBottom = '5px'
    container.appendChild(this.actorNameInput) 

    this.messageInput = document.createElement('textarea')
    this.messageInput.style.width = '100%'
    this.messageInput.rows = 4
    this.messageInput.placeholder = 'Message...'
    container.appendChild(this.messageInput)

    const submitBtn = document.createElement('button')
    submitBtn.innerHTML = 'Save changes'
    submitBtn.onclick = this.save
    container.appendChild(submitBtn)

    return container
  }

  save = () => {
    const display = `
      ${getActionLabel('@show_message:')}
      <p><b>${this.actorNameInput.value}:</b></p>
      <p>${this.messageInput.value}</p>
    `

    const eventAction: IEventAction<ShowMessagePayload> = {
      uuid: this.actionUuid,
      type: EventActionTypes.SHOW_TEXT,
      payload: {
        actorName: this.actorNameInput.value,
        message: this.messageInput.value,
      } as ShowMessagePayload,
      display,
    }

    this.onCommitChanges(eventAction)

    this.modalContext.close()
  }
}
