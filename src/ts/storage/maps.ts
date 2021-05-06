import { IMap } from "../editor/interfaces/IMap"

export const CURRENT_MAP_UUID_STORAGE_KEY = `currentMapUuid`
export const MAP_LIST_STORAGE_KEY = `maps`

export const getMaps = (): IMap[] => {
  return JSON.parse(window.localStorage.getItem(MAP_LIST_STORAGE_KEY)) || []
}

export const getCurrentMap = (): IMap => {
  return getMaps().find(map => map.uuid === getCurrentMapUuid())
}

export const getMapByUuid = (mapUuid: string): IMap => {
  return getMaps().find(map => map.uuid === mapUuid)
}

/**
 * Finds the map where the player spawn position is set
 */
export const getStartingMap = (): IMap => {
  return getMaps().find(map => map.layers.find(layer => Boolean(layer.startingPosition)))
}

export const getCurrentMapUuid = (): string => {
  return window.localStorage.getItem(CURRENT_MAP_UUID_STORAGE_KEY) || ''
}

export const setCurrentMapUuid = (uuid: string) => {
  window.localStorage.setItem(CURRENT_MAP_UUID_STORAGE_KEY, uuid)
}

export const setMaps = (maps: IMap[]) => {
  window.localStorage.setItem(MAP_LIST_STORAGE_KEY, JSON.stringify(maps))
}
