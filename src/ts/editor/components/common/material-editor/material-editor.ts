import shortid = require("shortid")
import { IResourceMaterial } from "src/ts/editor/interfaces/IResourceMaterial"
import { createElement } from "src/ts/editor/utils/ui"
import { Mesh, MeshPhongMaterial, Object3D } from "three"
import * as styles from './material-editor.css'

export class MaterialEditor {

  container: HTMLElement

  constructor() {

  }

  renderMaterialsInput = (container, loadedModel: Object3D, materials: IResourceMaterial[] = []) => {   
    container.innerHTML = ''

    const materialInputLabel = document.createElement('label')
    materialInputLabel.innerHTML = 'Materials'
    materialInputLabel.htmlFor = 'materials'
    container.appendChild(materialInputLabel)

    // First time setup
    if (materials?.length <= 0) {
      this.getMeshMaterials(loadedModel, materials)
    }

    const inputContainer = createElement('div', styles.materialInputContainer)
    container.appendChild(inputContainer)

    materials?.forEach((material, index) => {

      const materialLabel = createElement('label', styles.materialName) as HTMLLabelElement
      materialLabel.innerHTML = material.meshName
      inputContainer.appendChild(materialLabel)

      const checkboxContainer = createElement('div', styles.checkboxContainer)
      inputContainer.appendChild(checkboxContainer)

      const checkboxLabel = createElement('label', '') as HTMLLabelElement
      checkboxLabel.innerHTML = 'Use material from mesh'
      checkboxLabel.htmlFor = `checkboxLabel${index}`
      checkboxContainer.appendChild(checkboxLabel)

      const checkbox = document.createElement('input')
      checkbox.style.cursor = 'pointer'
      checkbox.id = `checkboxLabel${index}`
      checkbox.checked = material.useDefault
      checkbox.onchange = (value) => {
        // @ts-ignore
        materials[index].useDefault = value.target.checked
        this.renderMaterialsInput(container, loadedModel, materials)
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

        materials[index].texture = val

        this.renderMaterialsInput(container, loadedModel, materials)
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

        materials[index].color = val

        this.renderMaterialsInput(container, loadedModel, materials)
      }
      inputContainer.appendChild(colorInput)

    })
  }

  getMeshMaterials = (object: Object3D, materials: IResourceMaterial[] = []) => {
    object?.children?.forEach(child => {
      if (child?.hasOwnProperty('material')) {

        // @ts-ignore
        const childMaterial: MeshPhongMaterial | MeshPhongMaterial[] = child?.material

        if (Array.isArray(childMaterial) && childMaterial?.length) {
          childMaterial.forEach(mat => {
            materials.push({
              materialId: shortid.generate(),
              materialName: mat.name,
              meshName: `${child.name} - ${mat?.name}`,
              texture: null,
              color: null,
              useDefault: true,
            })  
          })
        } else {
          materials.push({
            materialId: shortid.generate(),
            // @ts-ignore
            materialName: childMaterial.name,
            // @ts-ignore
            meshName: `${child.name} - ${childMaterial?.name}`,
            texture: null,
            color: null,
            useDefault: true,
          }) 
        }
 
      }

      if (child?.children?.length) {
        this.getMeshMaterials(child, materials)
      }
    })
  }
}
