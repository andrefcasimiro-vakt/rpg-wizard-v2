import { ModelViewer } from "src/ts/editor/components/model-viewer/model-viewer"
import { EntityType } from "src/ts/editor/enums/EntityType"
import { IActor } from "src/ts/editor/interfaces/IActor"
import { IMap } from "src/ts/editor/interfaces/IMap"
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter"
import { Character } from "src/ts/engine/characters/character"
import { LoadingManager } from "src/ts/engine/core/loading-manager"
import { WorldEntityType } from "src/ts/engine/interfaces/IWorldEntity"
import { DatabaseActorsStorage, EntitiesStorage } from "src/ts/storage"
import { getResources } from "src/ts/storage/resources"
import { Group, Object3D, Texture, TextureLoader, Vector3 } from "three"

export class EntityLoader {
  entityTextureBank: { [entityUuid: string]: Texture } = {}
  entityPropBank: { [entityUuid: string]: Object3D } = {}
  loadingManager: LoadingManager;
  map: IMap

  constructor(loadingManager: LoadingManager, map: IMap) {
    this.loadingManager = loadingManager
    this.map = map
    this.loadEntities()
  }

  loadEntities = () => {
    const entities = EntitiesStorage.get()

    const textureLoader = new TextureLoader()

    var modelViewContainer = document.createElement('div')
    var modelViewer = new ModelViewer(modelViewContainer, 300, 300, 0.06)

    entities.push({
      uuid: 'player',
      name: 'player',
      graphicUuid: 'player',
      category: EntityType.PLAYER,
    })

    entities.forEach(entity => {
      const resource = entity.name !== 'player' ? EntitiesStorage.getEntityResource(entity.uuid) : null
      const category = resource?.category
      const entityResource = resource?.entityResource

      if (category == EntityType.Props) {
        let trackerEntry =this.loadingManager.addLoadingEntry(entityResource.downloadUrl)

        modelViewer.load(entityResource.downloadUrl, (object) => {
          object.scale.setScalar(0.01)

          this.entityPropBank[entity.uuid] = object;

          this.loadingManager.doneLoading(trackerEntry)
        })
      } else if (category == EntityType.Tiles) {
        let trackerEntry =this.loadingManager.addLoadingEntry(entityResource.downloadUrl)
        this.entityTextureBank[entity.uuid]  = textureLoader.load(entityResource.downloadUrl)
        this.loadingManager.doneLoading(trackerEntry)
      } else if (entity.category == EntityType.PLAYER) {
        let trackerEntry =this.loadingManager.addLoadingEntry(entity.graphicUuid)
        this.spawnPlayer()
        this.loadingManager.doneLoading(trackerEntry)
      }
    })
  }

  spawnPlayer = () => {
    const initialPosition = this.map.startingPosition
    const actor = DatabaseActorsStorage.get()?.[0] as IActor
    const actorGraphic = getResources()?.characters?.find(x => x.uuid == actor.graphicUuid) as IResourceCharacter

    this.loadingManager.loadFbx(actorGraphic.downloadUrl, (model: Group) => {
      model.scale.setScalar(actorGraphic.scale)

      let player = new Character(model, actorGraphic.animationClips, this.loadingManager.world)
      player.entityType = WorldEntityType.PLAYER

      player.setPosition(initialPosition.x, initialPosition.y + 1, initialPosition.z)

      this.loadingManager.world.add(player)

      player.takeControl()
    })
  }

}
