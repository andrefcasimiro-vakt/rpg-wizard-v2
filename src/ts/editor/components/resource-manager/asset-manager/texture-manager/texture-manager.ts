import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { IAnimationClip } from "src/ts/editor/interfaces/IAnimationClip";
import { IResource } from "src/ts/editor/interfaces/IResource";
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter";
import { createElement } from "src/ts/editor/utils/ui";
import { getResources } from "src/ts/storage/resources";
import { ModelViewer } from "../../../model-viewer/model-viewer";
import { AssetManager } from "../asset-manager";
import * as styles from './texture-manager.css'

export class TextureManager extends AssetManager {

  setupAsset = () => {

  }

  getAssetGui = () => {
    const container = createElement('div', styles.container)
    
    if (this.assetUrl) {
      const imagePreview = createElement('img', styles.textureImage) as HTMLImageElement
      container.appendChild(imagePreview)

      imagePreview.src = this.assetUrl
    }

    return container
  }


  getPayload = (): IResource => {
    return {
      uuid: this.assetUuid,
      displayName: this.assetName,
      downloadUrl: this.assetUrl,
    }
  }
}
