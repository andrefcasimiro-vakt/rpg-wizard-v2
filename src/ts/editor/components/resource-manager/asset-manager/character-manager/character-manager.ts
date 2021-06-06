import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { IAnimationClip } from "src/ts/editor/interfaces/IAnimationClip";
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter";
import { createElement } from "src/ts/editor/utils/ui";
import { getResources } from "src/ts/storage/resources";
import { ModelViewer } from "../../../model-viewer/model-viewer";
import { AssetManager } from "../asset-manager";
import * as styles from './character-manager.css'

export class CharacterManager extends AssetManager {

  animationClips: IAnimationClip[] = []
  scale: number = 0.006

  setupAsset = () => {
    const characters = getResources()?.characters
    const target = characters?.find(x => x.uuid == this.assetUuid) as IResourceCharacter
  
    this.scale = target ? target.scale : 0.006
  }

  getAssetGui = () => {
    const container = createElement('div', styles.container)
    
    const character = getResources()?.characters?.find(x => x.uuid == this.assetUuid) as IResourceCharacter
    this.animationClips = character?.animationClips || []

    // Render model preview
    this.renderModelPreview(container)

    // Model Scale
    this.renderScaleInput(container)

    // Model Animations
    this.renderAnimationFields(container)

    return container
  }

  renderModelPreview = (container) => {
      const modelViewContainer = this.getModelViewerContainerGui()
      container.appendChild(modelViewContainer)

      this.modelViewer = new ModelViewer(modelViewContainer, 300, 300, this.scale)
      this.modelViewer.load(this.assetUrl, () => {

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

  renderAnimationFields = (container) => {
    const content = createElement('div', styles.animationContent) as HTMLDivElement
    container.appendChild(content)

    if (!this.animationClips.length) {
      Object.keys(DefaultAnimations).forEach(x=> {
        this.animationClips.push({
          uuid: x,
          name: x,
          animationClipPath: '',
        })
      })
    }

    Object.keys(DefaultAnimations).forEach(defaultAnimationName => {
      const animationContainer = createElement('div', styles.animationContainer)
      content.appendChild(animationContainer)

      const existingAnimationIndex = this.animationClips.findIndex(x => x.name == defaultAnimationName)
      const existingAnimation = this.animationClips?.[existingAnimationIndex]

      // Animation name
      var animationNameInput = this.renderAnimationInput(
        'Animation Name',
        defaultAnimationName,
        (value) => {
          this.animationClips[existingAnimationIndex] = {
            ...existingAnimation,
            name: value,
          }
        },
        true
      ) as HTMLInputElement

      animationContainer.appendChild(animationNameInput)

      // Animation url
      var animationUrlInput = this.renderAnimationInput(
        `Animation Clip URL`,
        existingAnimation?.animationClipPath || '',
        (value) => {
          this.animationClips[existingAnimationIndex] = {
            ...existingAnimation,
            animationClipPath: value,
          }
        }
      )
      animationContainer.appendChild(animationUrlInput)
    })
  }
  
  renderAnimationInput = (
    animationName,
    currentValue,
    onChange,
    disabled = false,
  ) => {
    var container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'column'

    var label = document.createElement('label')
    label.htmlFor = animationName
    label.innerHTML = animationName
    container.appendChild(label)

    var input = document.createElement('input')
    input.id = animationName
    input.value = currentValue
    input.disabled = disabled
    // @ts-ignore
    input.onchange = (evt) => onChange(evt.target.value)
    container.appendChild(input)

    return container
  }

  getPayload = (): IResourceCharacter => {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
      scale: this.scale,
      animationClips: this.animationClips,
    }
  }
}
