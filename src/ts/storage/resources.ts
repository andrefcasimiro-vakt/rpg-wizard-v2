import _ = require("lodash")
import { IEvent } from "../editor/interfaces/IEvent"
import { IResource } from "../editor/interfaces/IResource"
import { IResourceCharacter } from "../editor/interfaces/IResourceCharacter"

export const RESOURCES_KEY = `resources`

export interface Resources {
  characters: IResourceCharacter[]
  props: IResource[]
  textures: IResource[]
  fx: IResource[]
  bgm: IResource[]
  se: IResource[]
}

export type ResourceKey = keyof Resources

export const addResource = (resource: IResource, key: ResourceKey): void => {
  const payload = getResources()

  // @ts-ignore
  payload[key].push(resource)

  setResources(payload)
}

export const updateResource = (resource: IResource, key: ResourceKey): void => {
  const payload = getResources()
  const idx = payload[key].findIndex(x => x.uuid == resource.uuid)
  payload[key][idx] = resource

  setResources(payload)
}

export const removeResource = (resource: IResource, key: ResourceKey): void => {
  const payload = getResources()
  _.pull(payload[key], resource)

  setResources(payload)
}

export const getResources = (): Resources => {
  return JSON.parse(window.localStorage.getItem(RESOURCES_KEY))
}

export const setResources = (payload: Resources) => {
  window.localStorage.setItem(RESOURCES_KEY, JSON.stringify(payload))
}

