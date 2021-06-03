import { createElement } from "../../utils/ui"
import { ModalContext } from "../modal-context"
import * as styles from './context-menu.css'

export interface ContextMenuOptions {
  [optionName: string]: () => void
}

export class ContextMenu {
  container: HTMLElement
  options: ContextMenuOptions


  public static initialize = () => {

    ContextMenu.drawGui()
  }

  public static drawGui() {
    var list = createElement('ul', styles.list)
    list.id = 'context-menu'
    list.style.display = 'none'
    document.body.appendChild(list)
  }

  public static open(container: HTMLElement, event: MouseEvent, options: ContextMenuOptions) {
    ContextMenu.close()

    var list = document.querySelector('#context-menu') as HTMLElement
    list.innerHTML = ''
    list.style.left = event.clientX + "px"
    list.style.top = event.clientY + "px"
    list.style.display = 'flex'

    Object.entries(options).forEach(option => {
      const item = createElement('li', styles.item)
      list.appendChild(item)

      const btn = createElement('button', styles.button)
      item.appendChild(btn)
      btn.innerHTML = option[0]

      btn.onclick = () => {
        option[1]()
        ContextMenu.close()
      }
    })
  }

  public static close = () => {
    var container = document.querySelector('#context-menu') as HTMLElement
    if (container) {
      container.style.display = 'none'
    }
  }
}

ContextMenu.initialize()
