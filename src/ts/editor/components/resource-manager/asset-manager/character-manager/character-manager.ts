import { AnimationEditor } from "src/ts/editor/components/common/animation-editor/animation-editor";
import { IAnimationClip } from "src/ts/editor/interfaces/IAnimationClip";
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter";
import { createElement } from "src/ts/editor/utils/ui";
import { getResources } from "src/ts/storage/resources";
import { AbstractModelManager } from "../abstract-model-manager/abstract-model-manager";
import * as styles from './character-manager.css'

export class CharacterManager extends AbstractModelManager {

  animationClips: IAnimationClip[] = []

  setupAsset() {
    const characters = getResources()?.characters
    const target = characters?.find(x => x.uuid == this.assetUuid) as IResourceCharacter

    this.scale = target?.scale || 0.006
  }

  getAssetGuiDetails = () => {
    const container = createElement('div', styles.container)
    
    const character = getResources()?.characters?.find(x => x.uuid == this.assetUuid) as IResourceCharacter
    this.animationClips = character?.animationClips || []

    if (this.assetUrl) {
      // Render model preview
      this.renderModelPreview(container)

      // Model Scale
      this.renderScaleInput(container)

      // Model Animations
      new AnimationEditor().renderAnimationFields(container, this.animationClips)
    }

    return container
  }

  getPayload = (): IResourceCharacter => {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
      scale: this.scale,
      animationClips: this.animationClips,
      materials: this.materials,
    }
  }
}
