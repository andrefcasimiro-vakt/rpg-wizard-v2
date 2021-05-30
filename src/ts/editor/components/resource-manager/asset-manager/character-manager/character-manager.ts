import { createElement } from "src/ts/editor/utils/ui";
import { AssetManager } from "../asset-manager";
import * as styles from './character-manager.css'

export class CharacterManager extends AssetManager {

  getAssetGui = () => {
    const container = createElement('div', styles.container)

    // @ts-ignore
    if (this.modelViewer?.model?.materials?.length > 0) {
      const materialsHeaderText = createElement('h3', '')
      materialsHeaderText.innerHTML = 'Materials'
      container.appendChild(materialsHeaderText)

      // @ts-ignore
      console.log(this.modelViewer?.model?.materials)
      // this.modelViewer?.model?.materials.forEach(material => {

      //   const animationFieldContainer = createElement('div', styles.animationField)
      //   container.appendChild(animationFieldContainer)
        
      //   const label = document.createElement('label')
      //   label.innerHTML = animationField[0]
      //   label.htmlFor = animationField[0]
      //   animationFieldContainer.appendChild(label)

      //   const select = document.createElement('select')
      //   select.id = animationField[0]
      //   animationFieldContainer.appendChild(select)

      //   // @ts-ignore
      //   var modelAnimations = this.modelViewer?.model?.animations || []
      //   console.log(this.modelViewer?.model)
      //   modelAnimations.forEach(modelAnimation => {
      //     const option = document.createElement('option')
      //     option.value = modelAnimation || 'text'
      //     select.appendChild(option)
      //   })

      // })
    }

    // // @ts-ignore
    // if (this.modelViewer?.model?.animations?.length > 0) {
    //   const animationsHeaderText = createElement('h3', '')
    //   animationsHeaderText.innerHTML = 'Animations'
    //   container.appendChild(animationsHeaderText)
  
    //   Object.entries(this.animations).forEach((animationField) => {
    //     const animationFieldContainer = createElement('div', styles.animationField)
    //     container.appendChild(animationFieldContainer)
        
    //     const label = document.createElement('label')
    //     label.innerHTML = animationField[0]
    //     label.htmlFor = animationField[0]
    //     animationFieldContainer.appendChild(label)

    //     const select = document.createElement('select')
    //     select.id = animationField[0]
    //     animationFieldContainer.appendChild(select)

    //     // @ts-ignore
    //     var modelAnimations = this.modelViewer?.model?.animations || []
    //     console.log(this.modelViewer?.model)

    //     const defaultOption = document.createElement('option')
    //     defaultOption.value = 'use_default'
    //     defaultOption.label = 'Use system default'
    //     select.appendChild(defaultOption)

    //     modelAnimations.forEach(modelAnimation => {
    //       const option = document.createElement('option')
    //       option.value = modelAnimation?.name || 'text'
    //       option.label = modelAnimation?.name || 'text'
    //       select.appendChild(option)
    //     })
    //   })
    // }

    return container
  }

}
