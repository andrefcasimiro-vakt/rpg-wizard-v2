import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { IAnimationClip } from "src/ts/editor/interfaces/IAnimationClip";
import { IResourceModel } from "src/ts/editor/interfaces/IResourceModel";
import { createElement } from "src/ts/editor/utils/ui";
import { getResources } from "src/ts/storage/resources";
import { AbstractModelManager } from "../abstract-model-manager/abstract-model-manager";
import * as styles from './prop-manager.css'

export class PropManager extends AbstractModelManager {

  animationClips: IAnimationClip[] = []

  setupAsset() {
    const props = getResources()?.props
    const target = props?.find(x => x.uuid == this.assetUuid) as IResourceModel
  
    this.scale = target?.scale || 0.006
    this.materials = target?.materials || []
  }

  getAssetGui = () => {
    const container = createElement('div', styles.container)
    
    const prop = getResources()?.props?.find(x => x.uuid == this.assetUuid) as IResourceModel

    // Render model preview
    this.renderModelPreview(container)

    // Model Scale
    this.renderScaleInput(container)

    return container
  }

  getPayload = (): IResourceModel => {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
      scale: this.scale,
      materials: this.materials,
    }
  }
}
