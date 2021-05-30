import { Theme } from "../config/theme"
import { DatabaseTabs } from "../enums/database"
import { includesHash } from "./modal"
import * as styles from './ui.css'

export const createElement = (type: string, className: string): HTMLElement => {
  var el = document.createElement(type)
  el.className = className

  return el
}

export const createElementWithTooltip = (children: HTMLElement, tooltipText: string): HTMLElement => {
  var container = document.createElement('div')
  container.className = 'tooltip'
  container.appendChild(children)
  
  var txt = document.createElement('span')
  txt.className = 'tooltiptext'
  txt.innerHTML = tooltipText
  container.appendChild(txt)

  return container
}

export const createListPanelGUI = (height = 250) => {
  const itemsPanel = document.createElement('ul')

  const itemsPanelStyle = itemsPanel.style
  itemsPanelStyle.display = 'flex'
  itemsPanelStyle.flexDirection = 'row'
  itemsPanelStyle.flexWrap = 'wrap'
  itemsPanelStyle.maxHeight = `${height}px`
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
  btnStyle.height = `30px`
  btnStyle.width = `100%`
  btnStyle.border = 'none'

  btnStyle.background = isActive ? `linear-gradient(to top, ${Theme.PRIMARY_DARK}, ${Theme.PRIMARY})` : Theme.NEUTRAL
    
  return btn
}

export const getActionLabel = (label: string) => {
  return `<p style="font-size: 11px"><b>${label}</b></p>`
}
