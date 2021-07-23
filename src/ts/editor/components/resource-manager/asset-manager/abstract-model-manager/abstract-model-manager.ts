import { MaterialEditor } from "src/ts/editor/components/common/material-editor/material-editor";
import { IResourceMaterial } from "src/ts/editor/interfaces/IResourceMaterial";
import { createElement } from "src/ts/editor/utils/ui";
import { ModelViewer } from "../../../model-viewer/model-viewer";
import { AssetManager } from "../asset-manager";
import * as styles from './abstract-model-manager.css'

export class AbstractModelManager extends AssetManager {

  scale: number = 0.006

  materials: IResourceMaterial[] = []

  materialContainer: HTMLDivElement

  modelViewer: ModelViewer

  getAssetGuiDetails = () => { 
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
    this.modelViewer.load(this.assetUrl, (loadedModel) => {
      this.materialContainer = createElement('div', styles.container) as HTMLDivElement
      container.appendChild(this.materialContainer)

      // Only render materials after model is loaded
      new MaterialEditor().renderMaterialsInput(this.materialContainer, loadedModel, this.materials)
    })
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

  onAssetUrlChange = () => {
    // Clean materials on model url change
    this.materials = []
  }
}
