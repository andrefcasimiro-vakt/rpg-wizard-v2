import { includes } from "lodash"
import { Theme, ZIndices } from "../config/theme"
import { includesHash } from "../utils/modal"

export class UIModal {
  private _isOpen: boolean = false
  
  public get isOpen() {
    return this._isOpen
  }

  public set isOpen(value: boolean) {
    this._isOpen = value

    this.render()
  }

  public hashParameter: string

  // Events
  public onHashChange: () => void;

  // UI
  public modalContainer: HTMLElement
  public modalContent: HTMLElement
  
  constructor(hashParameter: string) {
    this.hashParameter = hashParameter
    this.drawGui()

    window.addEventListener('hashchange', this.handleHashChange)
    this.handleHashChange()

    window.onclick = (event) => {
      if (event.target == this.modalContainer) {
        this.isOpen = false
      }
    }
  }

  handleHashChange = () => {
    this.isOpen = includesHash(this.hashParameter)

    if (this.onHashChange) {
      this.onHashChange()
    }
  }

  drawGui = () => {
    this.modalContainer = document.createElement('div')
    this.modalContainer.id = 'modal'
    const modalContainerStyle = this.modalContainer.style
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

    this.modalContent = document.createElement('div')
    const modalContentStyle = this.modalContent.style
    modalContentStyle.backgroundColor = Theme.LIGHT
    modalContentStyle.margin = 'auto'
    modalContentStyle.padding = '12px'
    modalContentStyle.width = '80%'

    this.modalContainer.appendChild(this.modalContent)
    document.body.appendChild(this.modalContainer)
  }

  render = () => {
    if (!this.isOpen) {
      this.close()
      return
    }

    this.modalContainer.style.display = 'flex'
  }

  close = () => {
    this.modalContainer.style.display = 'none'

    window.location.hash = ''
  }
}
