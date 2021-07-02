import { IResourceMaterial } from "src/ts/editor/interfaces/IResourceMaterial";
import { createElement } from "src/ts/editor/utils/ui";
import { Material, MeshPhongMaterial, Object3D } from "three";
import { ModelViewer } from "../../../model-viewer/model-viewer";
import { AssetManager } from "../asset-manager";
import * as styles from './abstract-model-manager.css'

export class AbstractModelManager extends AssetManager {

  scale: number = 0.006

  materials: IResourceMaterial[] = undefined

  materialContainer: HTMLDivElement

  getAssetGui = () => {    
    const container = createElement('div', styles.container)
    
    // Render model preview
    this.renderModelPreview(container)

    // Model Scale
    this.renderScaleInput(container)

    return container
  }

  onModelChange = () => {
    // Clean materials on model url change
    this.materials = undefined
  }

  renderModelPreview = (container) => {
    const modelViewContainer = this.getModelViewerContainerGui()
    container.appendChild(modelViewContainer)

    this.modelViewer = new ModelViewer(modelViewContainer, 300, 300, this.scale)
    this.modelViewer.load(this.assetUrl, (loadedModel) => {
      this.materialContainer = createElement('div', styles.container) as HTMLDivElement
      container.appendChild(this.materialContainer)
  
      // Only render materials after model is loaded
      this.renderMaterialsInput(this.materialContainer, loadedModel)
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

  renderMaterialsInput = (container, loadedModel: Object3D) => {   
    container.innerHTML = ''

    const materialInputLabel = document.createElement('label')
    materialInputLabel.innerHTML = 'Materials'
    materialInputLabel.htmlFor = 'materials'
    container.appendChild(materialInputLabel)

    const modelMaterials: IResourceMaterial[] = loadedModel?.children
      // @ts-ignore
      ?.filter(x => x?.material)
      .map(x => {
      // @ts-ignore
      const meshMaterial = x.material as MeshPhongMaterial

      // @ts-ignore
      return {
        materialUuid: meshMaterial?.uuid,
        meshName: x?.name,
        texture: null,
        color: null,
        useDefault: true,
      }
    })

    console.log('materials: ', this.materials)
    if (!this.materials?.length) {
      this.materials = modelMaterials || []
    }

    const inputContainer = createElement('div', styles.materialInputContainer)
    container.appendChild(inputContainer)

    // @ts-ignore
    this.materials?.forEach((material, index) => {

      const materialLabel = createElement('label', styles.materialName) as HTMLLabelElement
      materialLabel.innerHTML = material.meshName
      inputContainer.appendChild(materialLabel)

      const checkboxContainer = createElement('div', styles.checkboxContainer)
      inputContainer.appendChild(checkboxContainer)

      const checkboxLabel = createElement('label', '') as HTMLLabelElement
      checkboxLabel.innerHTML = 'Use material from mesh'
      checkboxLabel.htmlFor = `checkboxLabel${index}`
      checkboxContainer.appendChild(checkboxLabel)
        console.log(material)
      const checkbox = document.createElement('input')
      checkbox.style.cursor = 'pointer'
      checkbox.id = `checkboxLabel${index}`
      checkbox.checked = material.useDefault
      checkbox.onchange = (value) => {
        console.log(value)
        // @ts-ignore
        this.materials[index].useDefault = value.target.checked
        this.renderMaterialsInput(container, loadedModel)
      }
      checkbox.type = 'checkbox'
      checkboxContainer.appendChild(checkbox)

      if (material.useDefault == true) {
        return
      }

      const textureLabel = createElement('label', '') as HTMLLabelElement
      textureLabel.innerHTML = 'Texture URL'
      textureLabel.htmlFor = `textureInput${index}`
      inputContainer.appendChild(textureLabel)

      const textureInput = document.createElement('input')
      textureInput.id = `textureInput${index}`
      textureInput.defaultValue = material.texture
      textureInput.onchange = (evt) => {
        // @ts-ignore
        const val = evt.target.value
        
        this.materials[index].texture = val
  
        this.renderMaterialsInput(container, loadedModel)
      }
      inputContainer.appendChild(textureInput)


      const colorLabel = createElement('label', '') as HTMLLabelElement
      colorLabel.innerHTML = 'Color (Fallback if no texture is set)'
      colorLabel.htmlFor = `colorInput${index}`
      inputContainer.appendChild(colorLabel)

      const colorInput = document.createElement('input')
      colorInput.id = `colorInput${index}`
      colorInput.type = 'color'
      colorInput.defaultValue = material.color
      colorInput.onchange = (evt) => {
        // @ts-ignore
        const val = evt.target.value
        
        this.materials[index].color = val
  
        this.renderMaterialsInput(container, loadedModel)
      }
      inputContainer.appendChild(colorInput)
      
    })
    
  }

}
