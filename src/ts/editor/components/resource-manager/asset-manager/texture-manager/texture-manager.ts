import { IResource } from "src/ts/editor/interfaces/IResource";
import { createElement } from "src/ts/editor/utils/ui";
import { AssetManager } from "../asset-manager";
import * as styles from './texture-manager.css'

export class TextureManager extends AssetManager {

  setupAsset() { }

  getAssetGuiDetails = () => {
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
