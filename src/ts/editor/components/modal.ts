import shortid = require("shortid");
import { Theme, ZIndices } from "../config/theme"

export class Modal {

  public static initialize = () => {
    window.onclick = (event) => {
      if (event.target.id == 'modal') {
        Modal.close()
      }
    }

    Modal.drawGui()
  }

  public static drawGui = () => {
    var modalContainer = document.createElement('div')
    modalContainer.id = 'modal'

    const modalContainerStyle = modalContainer.style
    modalContainerStyle.display = 'none'
    modalContainerStyle.position = 'fixed'
    modalContainerStyle.zIndex = `${ZIndices.MODAL}`
    modalContainerStyle.left = '0'
    modalContainerStyle.top = '0'
    modalContainerStyle.width = '100%'
    modalContainerStyle.height = '100%'
    modalContainerStyle.overflow = 'auto'
    modalContainerStyle.backgroundColor = 'rgba(0, 0, 0)'
    modalContainerStyle.backgroundColor = 'rgba(0, 0, 0, 0.4)'

    var modalContent = document.createElement('div')
    modalContent.id = 'modalContent'
    const modalContentStyle = modalContent.style
    modalContentStyle.backgroundColor = Theme.LIGHT
    modalContentStyle.margin = 'auto'
    modalContentStyle.padding = '12px'
    modalContentStyle.width = '80%'

    modalContainer.appendChild(modalContent)
    document.body.appendChild(modalContainer)
  }

  public static open = (content: HTMLElement) => {
    var modalContainer = document.querySelector('#modal') as HTMLElement
    var modalContent = document.querySelector('#modalContent') as HTMLElement

    modalContent.innerHTML = ''

    modalContainer.style.display = 'flex'

    modalContent.appendChild(content)
  }

  public static close = () => {
    var modalContainer = document.querySelector('#modal') as HTMLElement
    var modalContent = document.querySelector('#modalContent') as HTMLElement

    modalContainer.style.display = 'none'
    modalContent.innerHTML = ''

    window.location.hash = ''
  }

  public static refresh = (content: HTMLElement) => {
    var modalContent = document.querySelector('#modalContent') as HTMLElement
    modalContent.innerHTML = ''
    modalContent.appendChild(content)
  }
  
}

Modal.initialize()
