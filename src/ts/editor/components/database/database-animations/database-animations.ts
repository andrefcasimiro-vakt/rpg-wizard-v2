import { DatabaseTabs } from "src/ts/editor/enums/database"
import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations"
import { createElement } from "src/ts/editor/utils/ui"
import { getDatabaseAnimations, updateAnimation } from "src/ts/storage/database_animations"
import { Database } from "../database"
import * as styles from './database-animations.css'

const HASH = DatabaseTabs.Animations

export class DatabaseAnimations extends Database {
  constructor() {
    super('Animations', HASH)

    this.handleHashChange()
  }

  getChildren = () => {
    const content = createElement('div', styles.content) as HTMLDivElement
    
    const animations = getDatabaseAnimations()

    Object.keys(DefaultAnimations).forEach(defaultAnimationName => {
      const existingAnimation = animations.find(x => x.uuid == defaultAnimationName)
      if (existingAnimation) {
        const animationContainer = createElement('div', styles.animationContainer)
        content.appendChild(animationContainer)

        // Animation name
        var animationNameInput = this.renderAnimationInput(
          'Animation Name',
          existingAnimation.name,
          (value) => updateAnimation({
            ...existingAnimation,
            name: value,
          }),
          true
        ) as HTMLInputElement

        animationContainer.appendChild(animationNameInput)

        // Animation url
        var animationUrlInput = this.renderAnimationInput(
          `Animation Clip URL`,
          existingAnimation.animationClipPath,
          (value) => updateAnimation({
            ...existingAnimation,
            animationClipPath: value,
          })
        )
        animationContainer.appendChild(animationUrlInput)
      }
    })

    return content
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
