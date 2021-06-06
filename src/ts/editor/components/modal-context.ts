import { Theme, ZIndices } from "../config/theme";

export class ModalContext {
  modalContainer: HTMLElement

  modalWrapper: HTMLElement
  modalNavbar: HTMLElement
  modalContent: HTMLElement

  onClose: () => void;

  drawGui = () => {
    this.modalContainer = document.createElement('div')

    const modalContainerStyle = this.modalContainer.style
    modalContainerStyle.display = 'flex'
    modalContainerStyle.position = 'fixed'
    modalContainerStyle.zIndex = `${ZIndices.MODAL_OVERLAY}`
    modalContainerStyle.left = '0'
    modalContainerStyle.top = '0'
    modalContainerStyle.width = '100%'
    modalContainerStyle.height = '100%'
    modalContainerStyle.overflow = 'auto'
    modalContainerStyle.backgroundColor = 'rgba(0, 0, 0)'
    modalContainerStyle.backgroundColor = 'rgba(0, 0, 0, 0.4)'

    this.modalWrapper = document.createElement('div')
    this.modalWrapper.style.backgroundColor = Theme.LIGHT
    this.modalWrapper.style.margin = 'auto'
    this.modalWrapper.style.padding = '12px'
    this.modalWrapper.style.width = '50%'
    this.modalContainer.appendChild(this.modalWrapper)

    // Modal Navbar
    const navbar = document.createElement('nav')
    navbar.style.height = '20px'
    navbar.style.display = 'flex'
    navbar.style.justifyContent = 'flex-end'
    this.modalWrapper.appendChild(navbar)

    const closeButton = document.createElement('button')
    const closeBtnStyle = closeButton.style
    closeBtnStyle.width = '20px'
    closeBtnStyle.height = '20px'
    closeBtnStyle.display = 'flex'
    closeBtnStyle.justifyContent = 'center'
    closeBtnStyle.alignItems = 'center'
    closeBtnStyle.background = Theme.DANGER
    closeBtnStyle.border = 'none'
    closeBtnStyle.color = Theme.LIGHT
    closeButton.onclick = this.close
    closeButton.innerHTML = 'X'
    navbar.appendChild(closeButton)

    // Modal Content
    this.modalContent = document.createElement('div')
    this.modalWrapper.appendChild(this.modalContent)
 
    document.body.appendChild(this.modalContainer)
  }

  open = (content: HTMLElement) => {
    this.drawGui()

    this.modalContent.appendChild(content)
  }

  close = () => {
    if (this.onClose) {
      this.onClose()
    }

    document.body.removeChild(this.modalContainer)
  }

  refresh = (content: HTMLElement) => {
    this.modalContent.innerHTML = ''
    this.modalContent.appendChild(content)
  }
}
