import { DatabaseTabs } from "src/ts/editor/enums/database"
import { createElement } from "src/ts/editor/utils/ui"
import { Modal } from "../../modal"
import { Database } from "../database"
import { createDatabaseContent, createDatabaseLayout } from "../database-utils"
import * as styles from './database-actors.css'

const HASH = DatabaseTabs.Actors

export class DatabaseActors extends Database {
  constructor() {
    super('Actors', HASH)

    this.handleHashChange()
  }

  getChildren = () => {
    const content = createElement('div', styles.content) as HTMLDivElement

    return content
  }

}
