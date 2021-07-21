import { EntityType } from "src/ts/editor/enums/EntityType"
import { EntitiesStorage } from "src/ts/storage"
import { Object3D, Texture, TextureLoader } from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

export class EntityLoader {

  entityTextureBank: { [entityUuid: string]: Texture } = {}
  entityPropBank: { [entityUuid: string]: Object3D } = {}

  constructor() {
    this.loadEntities()
  }

  loadEntities = () => {
    const entities = EntitiesStorage.get()

    const fbxLoader = new FBXLoader()
    const textureLoader = new TextureLoader()

    entities.forEach(entity => {
      const { entityResource, category } = EntitiesStorage.getEntityResource(entity.uuid)

      if (!entityResource) {
        return;
      }

      if (category == EntityType.Props) {
        fbxLoader.load(entityResource.downloadUrl, (object) => {
          object.scale.setScalar(0.01)
          this.entityPropBank[entity.uuid] = object;
        })
      } else if (category == EntityType.Tiles) {
        this.entityTextureBank[entity.uuid]  = textureLoader.load(entityResource.downloadUrl)
      }
      
    })

  }

}
