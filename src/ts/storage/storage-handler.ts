import { getFromStorage, saveToStorage } from "./utils"

interface Base {
  uuid: string
}

export class StorageHandler<T extends Base> {
  storageKey: string

  constructor(storageKey) {
    this.storageKey = storageKey
  }

  get = (): T[] => {
    return getFromStorage<T[]>(this.storageKey)
  }

  set = (payload: T[]): void => {
    saveToStorage<T[]>(this.storageKey, payload)
  }

  add = (payload: T) => {
    const nextState = this.get()
    nextState.push(payload)
    this.set(nextState)
  }

  update = (payload: T) => {
    const nextState = this.get()
    const idx = this.get().findIndex(x => x.uuid == payload.uuid)
    nextState[idx] = payload
    this.set(nextState)
  }
  
  remove = (uuid: string) => {
    const nextState = this.get()?.filter(x => x.uuid != uuid)
    this.set(nextState)
  }
}
