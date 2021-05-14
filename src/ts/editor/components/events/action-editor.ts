import { Theme } from "../../config/theme";
import { EventActionTypes } from "../../enums/EventActionTypes";
import { ModalContext } from "../modal-context";

const actions = {
  'Messages': {
    'Show Messages': EventActionTypes.SHOW_MESSAGE,
    // 'Show Choices': 'showChoices',
  },
  'Game Progression': {
    'Control Switches': EventActionTypes.CONTROL_SWITCHES,
  },
}

export class ActionEditor {

  modalContext: ModalContext = new ModalContext()

  constructor() {

  }

  open = () => {
    this.modalContext.open(this.drawGui())
  }

  drawGui = () => {
    const container = document.createElement('div')

    const title = document.createElement('h2')
    title.innerHTML = 'Actions List'
    container.appendChild(title)


    const list = document.createElement('section')
    list.style.border = `1px solid ${Theme.DARK}`
    list.style.padding = '2px'
    container.appendChild(list)

    Object.entries(actions).forEach(action => {
      const sectionTitle = document.createElement('h3')
      sectionTitle.innerHTML = action[0]
      sectionTitle.style.display = 'flex'
      sectionTitle.style.flexDirection = 'column'
      list.appendChild(sectionTitle)

      Object.entries(action[1]).forEach(item => {
        const btn = document.createElement('button')
        btn.innerHTML = item[0]
        btn.style.cursor = 'pointer'
        btn.style.width = '100%'
        btn.onclick = () => console.log(item[1])
        list.appendChild(btn)
      })
    })

    return container
  }

}
