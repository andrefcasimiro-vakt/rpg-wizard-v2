import { Theme } from "../config/theme"
import { DatabaseTabs } from "./database"
import { includesHash } from "./modal"

export const createListPanelGUI = (height = 250) => {
  const itemsPanel = document.createElement('ul')

  const itemsPanelStyle = itemsPanel.style
  itemsPanelStyle.display = 'flex'
  itemsPanelStyle.flexDirection = 'row'
  itemsPanelStyle.flexWrap = 'wrap'
  itemsPanelStyle.height = `${height}px`
  itemsPanelStyle.padding = `5px`
  itemsPanelStyle.border = `1px solid ${Theme.PRIMARY_DARK}`
  itemsPanelStyle.borderBottom = 'none'
  itemsPanelStyle.overflow = 'scroll'

  return itemsPanel
}

export const createActionPanelGUI = () => {
  const actionsPanel = document.createElement('ul')
  const actionsPanelStyle = actionsPanel.style
  actionsPanelStyle.display = 'flex'
  actionsPanelStyle.border = `1px solid ${Theme.PRIMARY_DARK}`

  return actionsPanel
}

export const createActionButtonGUI = (label: string, isActive?: boolean) => {
  const btn = document.createElement('button')
  btn.innerHTML = label

  const btnStyle = btn.style
  btnStyle.display = 'flex'
  btnStyle.alignItems = 'center'
  btnStyle.justifyContent = 'center'
  btnStyle.cursor = 'pointer'
  btnStyle.height = `30px`
  btnStyle.width = `100%`
  btnStyle.border = 'none'

  btnStyle.background = isActive ? `linear-gradient(to top, ${Theme.PRIMARY_DARK}, ${Theme.PRIMARY})` : Theme.NEUTRAL
    
  return btn
}

export const createDatabaseSidebar = (activeHash: string) => {
  const sidebar = document.createElement('ul')

  const style = sidebar.style
  style.display = 'flex';
  style.flexDirection = 'column';

  Object.entries(DatabaseTabs).forEach((option) => {
    const isActive = includesHash(option[1])

    const item = document.createElement('li')
    item.innerHTML = `
      <button style="
        width: 100%;
        background: ${isActive ? Theme.PRIMARY : Theme.NEUTRAL};
        border: 1px solid ${isActive ? Theme.PRIMARY_DARK : Theme.NEUTRAL_DARK};
      ">
        <a href="${option[1]}">${option[0]}</a>
      </button>
    `

    sidebar.appendChild(item)
  })

  return sidebar
}
