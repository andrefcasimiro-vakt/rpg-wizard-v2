import { IResource } from "src/ts/editor/interfaces/IResource";
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter";
import { createElement } from "src/ts/editor/utils/ui";
import { getResources } from "src/ts/storage/resources";
import { AssetManager } from "../asset-manager";
import * as styles from './character-manager.css'

export class CharacterManager extends AssetManager {

  scale: number = 0.006

  getAssetGui = () => {
    const characters = getResources().characters
    const target = characters.find(x => x.uuid == this.assetUuid) as IResourceCharacter
    if (!target) {
      this.scale = 0.006
    } else {
      this.scale = target.scale
    }

    const container = createElement('div', styles.container)
          
    const label = document.createElement('label')
    label.innerHTML = 'Model Scale'
    label.htmlFor = 'modelScale'
    container.appendChild(label)
  
    const input = document.createElement('input')
    input.value = this.scale.toString()
    input.type = 'number'
    input.onchange = (evt) => {
      // @ts-ignore
      const val = evt.target.value
      
      this.scale = val
    }

    container.appendChild(input)

    return container
  }

  getPayload = (): IResourceCharacter => {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
      scale: this.scale,
    }
  }

}
