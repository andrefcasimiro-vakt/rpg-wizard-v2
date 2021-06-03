import shortid = require("shortid");
import { IResource } from "src/ts/editor/interfaces/IResource";
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter";
import { createElement } from "src/ts/editor/utils/ui"
import { getResources } from "src/ts/storage/resources";
import { ModalContext } from "../../modal-context"
import { ModelViewer } from "../../model-viewer/model-viewer";
import * as styles from './asset-manager.css'

export class AssetManager {
  modalContext: ModalContext = new ModalContext()
  
  assetUuid: string;
  assetName: string;
  assetUrl: string;

  modelViewer: ModelViewer

  scale: number = 0.006

  public handleOnSave: (payload: IResource) => void

  resourceType: string 

  constructor(resourceType: string) {
    this.resourceType = resourceType
  }

  open = () => {
    if (!this.assetUuid) {
      this.assetUuid = shortid.generate()
    }

    // Character case
    const characters = getResources()?.characters
    const target = characters?.find(x => x.uuid == this.assetUuid) as IResourceCharacter
    if (!target) {
      this.scale = 0.006
    } else {
      this.scale = target.scale
    }

    this.modalContext.open(this.getGui())
  }

  getGui = () => {
    const container = createElement('div', styles.container)

    const grid = createElement('div', styles.grid)
    container.appendChild(grid)

    const assetSettingsContainer = createElement('div', styles.assetSettingsContainer)
    grid.appendChild(assetSettingsContainer)
    assetSettingsContainer.appendChild(this.getAssetConfigurationGui())

    if (this.assetUrl && this.resourceType == 'characters') {
      const modelViewContainer = this.getModelViewerContainerGui()
      assetSettingsContainer.appendChild(modelViewContainer)

      this.modelViewer = new ModelViewer(modelViewContainer, 300, 300, this.scale)
      this.modelViewer.load(this.assetUrl, () => {
        this.renderAssetSettings(grid)
      })
    }

    console.log(this.resourceType)

    if (this.assetUrl && this.resourceType == 'textures') {
      const imagePreview = createElement('img', styles.textureImage) as HTMLImageElement
      assetSettingsContainer.appendChild(imagePreview)

      imagePreview.src = this.assetUrl
    }

    return container
  }

  /** Loads asset settings after the asset has been loaded */
  renderAssetSettings = (parent: HTMLElement) => {
    // Children need to be draswn after model viewer loads the model so we can access it here
    const childrenContainer = createElement('div', styles.childrenContainer)
    parent.appendChild(childrenContainer)
    childrenContainer.appendChild(this.getAssetGui())

    const submitButton = createElement('button', styles.submitButton) as HTMLButtonElement
    submitButton.innerHTML = 'Save changes'
    submitButton.style.marginTop = '20px'
    submitButton.onclick = () => {
      this.handleOnSave(this.getPayload())
    }
    parent.appendChild(submitButton)
  }

  getHeader = (title: string) => {
    const headerText = createElement('h3', styles.headerText)
    headerText.innerHTML = title

    return headerText
  }

  getModelViewerContainerGui = (): HTMLElement => {
    const modelViewerContainer = createElement('div', styles.modelViewerContainer)
    return modelViewerContainer
  }

  getAssetConfigurationGui = (): HTMLElement => {
    const assetConfigurationContent = createElement('div', styles.assetConfigurationContent)
    
    // assetConfigurationContent.appendChild(this.getHeader('Asset Information'))

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
      },
      this.assetUrl,
      'Copy the direct link of your mixamo 3D model (available formats: .fbx)'
    )

    return assetConfigurationContent
  }

  getAssetGui = (): HTMLElement => {
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
    this.modalContext.close()
  }

  getPayload = (): IResource => {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
    }
  }
}
