import { DatabaseTabs } from "../../enums/database";
import { includesHash } from "../../utils/modal";
import { createElement } from "../../utils/ui";
import * as styles from './database-utils.css'

export const createDatabaseLayout = () => {
  const container = createElement('div', styles.databaseContainer)

  const sidebarPanel = createElement('div', styles.sidebarPanel)
  container.appendChild(sidebarPanel)

  sidebarPanel.appendChild(createDatabaseSidebar())

  return container
}

export const createDatabaseContent = () => {
  const content = createElement('div', styles.contentPanel)
  
  return content
}

export const createDatabaseSidebar = () => {
  const sidebar = document.createElement('ul')

  Object.entries(DatabaseTabs).forEach((option) => {
    const isActive = includesHash(option[1])

    const item = document.createElement('li')
    sidebar.appendChild(item)

    const btn = createElement('button', styles.databaseSidebarButton)
    if (isActive) {
      btn.className = `${btn.className} ${styles.databaseSidebarButtonActive}`
    }
    item.appendChild(btn)

    const link = createElement('a', '') as HTMLAnchorElement
    link.innerHTML = option[0]
    link.href = option[1]
    btn.appendChild(link)
  })

  return sidebar
}
