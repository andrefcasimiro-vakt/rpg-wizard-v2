import { Theme } from "../config/theme";
import { IEditor } from "../interfaces/IEditor";
import { IEventPage } from "../interfaces/IEventPage";
import { UIModal } from "./ui-modal";

const HASH = '#event'

export class EventEditor extends UIModal implements IEditor {

  eventPages: IEventPage[] = []

  currentEventUuid: string | null;

  constructor() {
    super(HASH)

    this.updateGUI()

    this.onHashChange = this.updateGUI
  }

  open = (eventUuid: string) => {
    this.currentEventUuid = eventUuid
    this.hashParameter = `${HASH}_${eventUuid}`
    window.location.hash = this.hashParameter
  }

  updateGUI = () => {
    this.modalContent.innerHTML = ''
    const content = document.createElement('div')
    content.innerHTML = `
      <div style="
        display: flex;
        flex-direction: row;
      ">
        <section style="
          width: 100px;
          border-right: 1px solid ${Theme.PRIMARY_LIGHT}
        ">
        </section>

        <section style="
          display: flex;
          margin-left: 10px;
        ">
          <h2>Event ${this.currentEventUuid}</h2>
        </section>
      </div>
    `

    this.modalContent.appendChild(content)
  }

  save = () => {

  }

  load = () => {

  }
}
