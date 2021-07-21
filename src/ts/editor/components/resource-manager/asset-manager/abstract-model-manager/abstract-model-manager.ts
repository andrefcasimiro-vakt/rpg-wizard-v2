import { createElement } from "src/ts/editor/utils/ui";
import { ModelViewer } from "../../../model-viewer/model-viewer";
import { AssetManager } from "../asset-manager";
import * as styles from './abstract-model-manager.css'

export class AbstractModelManager extends AssetManager {

  scale: number = 0.006

  materialContainer: HTMLDivElement

  modelViewer: ModelViewer

  getAssetGui = () => { 
    const container = createElement('div', styles.container)
    
    // Render model preview
    this.renderModelPreview(container)

    // Model Scale
    this.renderScaleInput(container)

    return container
  }

  renderModelPreview = (container) => {
    const modelViewContainer = this.getModelViewerContainerGui()
    container.appendChild(modelViewContainer)

    this.modelViewer = new ModelViewer(modelViewContainer, 300, 300, this.scale)
    this.modelViewer.load(this.assetUrl)
  }

  getModelViewerContainerGui = (): HTMLElement => {
    const modelViewerContainer = createElement('div', styles.modelViewerContainer)
    return modelViewerContainer
  }

  renderScaleInput = (container) => {
    const scaleInputLabel = document.createElement('label')
    scaleInputLabel.innerHTML = 'Model Scale'
    scaleInputLabel.htmlFor = 'modelScale'
    container.appendChild(scaleInputLabel)

    const scaleInput = document.createElement('input')
    scaleInput.defaultValue = this.scale.toString()
    scaleInput.type = 'number'
    scaleInput.onchange = (evt) => {
      // @ts-ignore
      const val = evt.target.value
      
      this.scale = val

      this.update()
    }

    container.appendChild(scaleInput)
  }

}
