import { Vector3 } from "three"
import { StorageHandler } from "."
import { IMap } from "../editor/interfaces/IMap"

export const MAP_LIST_STORAGE_KEY = `maps`

class MapStorageHandler extends StorageHandler<IMap> {
  constructor() {
    super(MAP_LIST_STORAGE_KEY)
  }

  getCurrentMap = () => {
    return this.get().find(x => x.uuid == getCurrentMapUuid())
  }

  setCurrentMap = (uuid: string) => {
    setCurrentMapUuid(uuid)
  }
  
  getStartingMap = () => {
    const maps = this.get() || []

    return maps.find(map => Boolean(map.startingPosition))
  }

  remove = (mapUuid: string) => {
    const maps = this.get() || []

    const nextState = maps.filter(x => {

      if (x.parentUuid == mapUuid) {
        return false
      }

      if (x.uuid == mapUuid) {
        return false
      }

      return true
    })

    this.set(nextState)
  }

  getStartingPosition = (): Vector3 | null => {
    const mapWithStartingPosition = this.get().find(x => Boolean(x.startingPosition))

    const currentMap = this.getCurrentMap()

    if (mapWithStartingPosition?.uuid == currentMap?.uuid) {
      return mapWithStartingPosition.startingPosition
    }

    return null
  }

  setStartingPosition = (nextPosition) => {
    const currentMap = this.getCurrentMap()

    const nextState = this.get().map(x => ({ ...x, startingPosition: x.uuid == currentMap.uuid ? nextPosition : null }))

    this.set(nextState)
  }
}

export const MapStorage = new MapStorageHandler()



export const CURRENT_MAP_UUID_STORAGE_KEY = `currentMapUuid`

export const getCurrentMapUuid = (): string => {
  return window.localStorage.getItem(CURRENT_MAP_UUID_STORAGE_KEY) || ''
}

export const setCurrentMapUuid = (uuid: string) => {
  window.localStorage.setItem(CURRENT_MAP_UUID_STORAGE_KEY, uuid)
}
