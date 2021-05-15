import shortid = require("shortid");
import { EventActionTypes } from "../../../../../editor/enums/EventActionTypes";
import { Theme } from "../../../../../editor/config/theme";
import { IEventAction } from "../../../../../editor/interfaces/IEventAction";
import { ModalContext } from "../../../modal-context";
import { EventActionEditor } from "../event-action-editor";

export interface IShowMessage {
  actorName: string;
  messages: string[];
}

export class ShowMessages extends EventActionEditor {
  textBox: HTMLTextAreaElement

  modalContext: ModalContext = new ModalContext()

  open = () => {
    this.modalContext.open(this.drawGui())
  }


  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Show Message'
    container.appendChild(title)


    this.textBox = document.createElement('textarea')
    this.textBox.style.width = '100%'
    this.textBox.value = 'Message...'
    container.appendChild(this.textBox)

    const submitBtn = document.createElement('button')
    submitBtn.innerHTML = 'Save changes'
    submitBtn.onclick = this.save
    container.appendChild(submitBtn)

    return container
  }

  save = () => {
    const display = `
      <b>@ Show Message</b>
      <b>Actor: </b> 'Actor'
      <p>${this.textBox.value}</p>
    `

    const eventAction: IEventAction<IShowMessage> = {
      uuid: shortid.generate(),
      type: EventActionTypes.SHOW_TEXT,
      payload: {
        actorName: 'Actor',
        messages: [this.textBox.value]
      } as IShowMessage,
      display,
    }

    this.onCommitChanges(eventAction)

    this.modalContext.close()
  }
}
