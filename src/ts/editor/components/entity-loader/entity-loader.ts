import { ModelViewer } from "src/ts/editor/components/model-viewer/model-viewer"
import { EntityType } from "src/ts/editor/enums/EntityType"
import { createElement } from "src/ts/editor/utils/ui"
import { LoadingTracker } from "src/ts/engine/core/loading-tracker"
import { EntitiesStorage } from "src/ts/storage"
import { DirectionalLight, HemisphereLight, Object3D, PerspectiveCamera, Scene, Texture, TextureLoader, WebGLRenderer } from "three"
import * as styles from './entity-loader.css'
export class EntityLoader {

  entityTextureBank: { [entityUuid: string]: Texture } = {}
  entityPropBank: { [entityUuid: string]: Object3D } = {}

  entityThumbnails: { [entityUuid: string ]: string } = {}

  loadingTracker: LoadingTracker[] = []

  onFinishedCallback: () => void

  loadingContainer: HTMLElement

  constructor() {
    this.loadingContainer = createElement('div', styles.loadingEntitiesContainer)
    document.body.appendChild(this.loadingContainer)

    this.showLoadingUi()
    this.loadEntities()
  }

  showLoadingUi = () => {
    this.loadingContainer.style.display = 'flex'

    var messageContainer = createElement('div', styles.messageContainer)
    this.loadingContainer.appendChild(messageContainer)
    var messageText = createElement('h4', styles.message)
    messageContainer.appendChild(messageText)

    messageText.innerHTML = `Loading entities into the scene...`
  }

  hideLoadingUi = () => {
    this.loadingContainer.style.display = 'none'
  }

  addLoadingEntry = (path: string): LoadingTracker => {
    const entry = new LoadingTracker(path)
    this.loadingTracker.push(entry)
    return entry
  }

  loadEntities = () => {
    const entities = EntitiesStorage.get()

    const textureLoader = new TextureLoader()

    var modelViewContainer = document.createElement('div')
    var modelViewer = new ModelViewer(modelViewContainer, 300, 300, 0.06)

    entities.forEach(entity => {
      const { entityResource, category } = EntitiesStorage.getEntityResource(entity.uuid)

      if (!entityResource) {
        this.hideLoadingUi()
        return;
      }

      if (category == EntityType.Props) {
        let trackerEntry = this.addLoadingEntry(entityResource.downloadUrl)

        modelViewer.load(entityResource.downloadUrl, (object) => {
          object.scale.setScalar(0.01)

          this.entityPropBank[entity.uuid] = object;

          // Sems to fix race condition : https://stackoverflow.com/a/37688550
          setTimeout(() => {
            var screenshot = modelViewer.takeScreenshot()
            this.entityThumbnails[entity.uuid] = screenshot

            this.doneLoading(trackerEntry)
          }, 1)
        })
      } else if (category == EntityType.Tiles) {
        let trackerEntry = this.addLoadingEntry(entityResource.downloadUrl)

        this.entityTextureBank[entity.uuid]  = textureLoader.load(entityResource.downloadUrl)
        this.entityThumbnails[entity.uuid] = entityResource.downloadUrl

        this.doneLoading(trackerEntry)
      }
    })
  }


  doneLoading = (trackerEntry: LoadingTracker) => {
    trackerEntry.finished = true
    trackerEntry.progress = 1

    if (this.isLoadingDone()) {
      if (this.onFinishedCallback) this.onFinishedCallback()

      this.hideLoadingUi()
    }
  }

  isLoadingDone = (): boolean => {
    for (const entry of this.loadingTracker) {
      if (entry.finished === false) return false
    }

    return true
  }

}
