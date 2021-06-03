import { StorageHandler } from ".";
import { EntityType } from "../editor/enums/EntityType";
import { IEntity } from "../editor/interfaces/IEntity";
import { IResource } from "../editor/interfaces/IResource";
import { getResources } from "./resources";
import { getFromStorage, saveToStorage } from "./utils";

const EntitiesListKey = `entities`

class EntitiesStorageHandler extends StorageHandler<IEntity> {
  constructor() {
    super(EntitiesListKey)
  }

  setCurrentMode(mode: EntityType) {
    setCurrentEntityMode(mode)
  }

  getCurrentMode(): EntityType {
    return getCurrentEntityMode() as EntityType
  }

  setCurrentEntity(entityUuid: string) {
    setCurrentEntityUuid(entityUuid)
  }

  getCurrentEntity() {
    return this.get()?.find(x => x.uuid == getCurrentEntityUuid())
  }

  getEntityResource(entityUuid: string) {
    const entity = this.get().find(x => x.uuid == entityUuid)

    let resourceBank: IResource[] = []
    if (entity.category == EntityType.Props) {
      resourceBank = getResources().props
    } else if (entity.category == EntityType.Ground) {
      resourceBank = getResources().textures
    }

    return resourceBank.find(x => x.uuid == entity.graphicUuid)
  }
}

export const EntitiesStorage = new EntitiesStorageHandler()

const CurrentEntityModeKey = `currentEntityMode`

export const getCurrentEntityMode = (): string => {
  return getFromStorage(CurrentEntityModeKey)
}
export const setCurrentEntityMode = (uuid: string) => {
  saveToStorage(CurrentEntityModeKey, uuid)
}

const CurrentEntityUuidKey = `currentEntityUuid`

export const getCurrentEntityUuid = (): string => {
  return getFromStorage(CurrentEntityUuidKey)
}
export const setCurrentEntityUuid = (uuid: string) => {
  saveToStorage(CurrentEntityUuidKey, uuid)
}
