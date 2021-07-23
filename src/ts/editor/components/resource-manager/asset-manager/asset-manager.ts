import shortid = require("shortid");
import { IResource } from "src/ts/editor/interfaces/IResource";
import { createElement } from "src/ts/editor/utils/ui"
import { ModalContext } from "../../modal-context"
import * as styles from './asset-manager.css'

export class AssetManager {
  modalContext: ModalContext
  
  assetUuid: string;
  assetName: string;
  assetUrl: string;

  public handleOnSave: (payload: IResource) => void

  public onClose: () => void

  resourceType: string 

  constructor(resourceType: string) {
    this.modalContext = new ModalContext()
    this.modalContext.onClose = this.close

    this.resourceType = resourceType
  }

  setupAsset () {}

  open = () => {
    if (!this.assetUuid) {
      this.assetUuid = shortid.generate()
    }

    this.setupAsset()

    this.modalContext.open(this.getGui())
  }

  getGui = () => {
    const container = createElement('div', styles.container)

    const grid = createElement('div', styles.grid)
    container.appendChild(grid)

    const assetSettingsContainer = createElement('div', styles.assetSettingsContainer)
    grid.appendChild(assetSettingsContainer)
    assetSettingsContainer.appendChild(this.getAssetNameAndUrlSettings())

    const childrenContainer = createElement('div', styles.childrenContainer)
    grid.appendChild(childrenContainer)
    childrenContainer.appendChild(this.getAssetGuiDetails())

    const submitButton = createElement('button', styles.submitButton) as HTMLButtonElement
    submitButton.innerHTML = 'Save changes'
    submitButton.style.marginTop = '20px'
    submitButton.onclick = () => {
      this.handleOnSave(this.getPayload())

      this.modalContext.close()
    }
    grid.appendChild(submitButton)

    return container
  }

  getAssetNameAndUrlSettings = (): HTMLElement => {
    const assetConfigurationContent = createElement('div', styles.assetConfigurationContent)
    
    this.renderInput(
      assetConfigurationContent,
      'Asset Name',
      'assetName',
      (value) => {
        this.assetName = value
      },
      this.assetName,
      ''
    )

    this.renderInput(
      assetConfigurationContent,
      'Asset URL',
      'assetUrl',
      (value) => {
        this.assetUrl = value
        
        this.update()

        this.onAssetUrlChange()
      },
      this.assetUrl,
      'Copy the direct link of your mixamo 3D model (available formats: .fbx)'
    )

    return assetConfigurationContent
  }

  getAssetGuiDetails = (): HTMLElement => {
    const childrenContent = createElement('div', styles.childrenContent)
    
    return childrenContent
  }

  renderInput = (container, label, inputId, callback, defaultValue, tooltip) => {
    const labelElement = document.createElement('label')
    labelElement.htmlFor = inputId
    labelElement.innerHTML = label
    container.appendChild(labelElement)

    if (tooltip?.length) {
      const tooltipText = document.createElement('p')
      tooltipText.innerHTML = `<em>${tooltip}</em>`
      tooltipText.style.fontSize = '10px'
      container.appendChild(tooltipText)
    }

    const input = document.createElement('input')
    input.id = inputId
    input.onchange = (evt) => {
      // @ts-ignore
      callback(evt.target.value)
    }
    input.defaultValue = defaultValue || ''

    container.appendChild(input)
  }

  update = () => {
    this.modalContext.refresh(this.getGui())
  }

  close = () => {
    if (this.onClose) {
      this.onClose()
    }
  }

  getPayload(): IResource {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
    }
  }

  onAssetUrlChange = () => {}
}
