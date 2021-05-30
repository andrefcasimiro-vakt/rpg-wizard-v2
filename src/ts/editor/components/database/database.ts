import { createElement } from "src/ts/editor/utils/ui"
import { Modal } from "../modal"
import { createDatabaseContent, createDatabaseLayout } from "./database-utils"

export abstract class Database {

  name: string
  hash: string

  constructor(name, hash) {
    this.name = name
    this.hash = hash 

    window.addEventListener('hashchange', () => {
      this.handleHashChange()
    })

    // Need to call at the beginning as well
    this.handleHashChange()
  }

  handleHashChange = () => {
    if (window.location.hash.includes(this.hash)) {
      Modal.open(this.getGui())
    }
  }

  open = () => {
    window.location.hash = this.hash
  }

  getGui = () => {
    const dbLayout = createDatabaseLayout()

    const content = createDatabaseContent()
    dbLayout.appendChild(content)

    const headerText = createElement('h3', '')
    headerText.innerHTML = this.name
    content.appendChild(headerText)

    const children = this.getChildren()
    content.appendChild(children)

    return dbLayout
  }

  abstract getChildren = (): HTMLElement => {
    const content = document.createElement('div')
    return content
  }

}
