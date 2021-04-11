import { Theme } from "../config/theme";
import { IEditor } from "../interfaces/IEditor";
import { DatabaseTabs } from "../utils/database";
import { createDatabaseSidebar } from "../utils/ui";
import { UIModal } from "./ui-modal";

const ACTORS_STORAGE_KEY = `actors`

const HASH = DatabaseTabs.Actors

export class DatabaseActors extends UIModal implements IEditor {

  constructor() {
    super(HASH)

    this.updateGUI()

    this.onHashChange = this.updateGUI
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
          ${createDatabaseSidebar(HASH).innerHTML}
        </section>

        <section style="
          display: flex;
          margin-left: 10px;
        ">
          <h2>Actors</h2>
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
