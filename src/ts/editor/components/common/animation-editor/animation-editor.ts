import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations"
import { IAnimationClip } from "src/ts/editor/interfaces/IAnimationClip"
import { createElement } from "src/ts/editor/utils/ui"
import * as styles from './animation-editor.css'

export class AnimationEditor {

  container: HTMLElement

  constructor() {

  }

  renderAnimationFields = (container: HTMLElement, animationClips: IAnimationClip[]) => {
    const content = createElement('div', styles.animationContent) as HTMLDivElement
    container.appendChild(content)

    const label = document.createElement('label')
    label.innerHTML = 'Animations'
    content.appendChild(label)


    if (!animationClips.length) {
      Object.keys(DefaultAnimations).forEach(x=> {
        animationClips.push({
          uuid: x,
          name: x,
          animationClipPath: '',
        })
      })
    }

    Object.keys(DefaultAnimations).forEach(defaultAnimationName => {
      const animationContainer = createElement('div', styles.animationContainer)
      content.appendChild(animationContainer)

      const existingAnimationIndex = animationClips.findIndex(x => x.name == defaultAnimationName)
      const existingAnimation = animationClips?.[existingAnimationIndex]

      // Animation name
      var animationNameInput = this.renderAnimationInput(
        'Animation Name',
        defaultAnimationName,
        (value) => {
          animationClips[existingAnimationIndex] = {
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
          animationClips[existingAnimationIndex] = {
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

}
