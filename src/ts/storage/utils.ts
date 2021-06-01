import { DatabaseActorsStorage } from "./"
import { getResources, setResources } from "./resources"

export function saveToStorage<T>(key: string, payload: T) {
  window.localStorage.setItem(key, JSON.stringify(payload))
}

export function getFromStorage<T>(key: string): T {
  return JSON.parse(window.localStorage.getItem(key))
}

export const initializeStore = () => {

  if (getResources() == null) {
    setResources({
      characters: [],
      props: [],
      textures: [],
      fx: [],
      bgm: [],
      se: [],
    })
  }

  if (DatabaseActorsStorage.get() == null) {
    DatabaseActorsStorage.set([{
      uuid: 'Alex',
      name: 'Alex',
      graphicUuid: 'Alex'
    }])
  }
}
