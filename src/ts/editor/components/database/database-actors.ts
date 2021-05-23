import { Theme } from "../../config/theme";
import { IEditor } from "../../interfaces/IEditor";
import { DatabaseTabs } from "../../enums/database";
import { createDatabaseSidebar } from "../../utils/ui";
import { Modal } from "../modal";

const ACTORS_STORAGE_KEY = `actors`

const HASH = DatabaseTabs.Actors

export class DatabaseActors implements IEditor {


  constructor() {
    window.addEventListener('hashchange', () => {
      this.handleHashChange()
    })

    // Need to call at the beginning as well
    this.handleHashChange()
  }


  handleHashChange = () => {
    if (window.location.hash.includes(HASH)) {
      Modal.open(this.getGui())
    }
  }

  open = () => {
    window.location.hash = HASH
  }

  getGui = () => {
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
    return content
  }

  save = () => {

  }

  load = () => {

  }
}
