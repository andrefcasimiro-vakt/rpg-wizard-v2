import { IAnimationClip } from "../editor/interfaces/IAnimationClip"
import { getFromStorage, saveToStorage } from "./utils"

export const KEY = `database_animations`

export const getDatabaseAnimations = (): IAnimationClip[] => {
  return getFromStorage<IAnimationClip[]>(KEY)
}

export const setDatabaseAnimations = (payload: IAnimationClip[]) => {
  saveToStorage<IAnimationClip[]>(KEY, payload)
}

export const addAnimation = (payload: IAnimationClip) => {
  const nextState = getDatabaseAnimations()
  nextState.push(payload)
  setDatabaseAnimations(nextState)
}

export const updateAnimation = (payload: IAnimationClip) => {
  const nextState = getDatabaseAnimations()
  const idx = getDatabaseAnimations().findIndex(x => x.uuid == payload.uuid)
  nextState[idx] = payload
  setDatabaseAnimations(nextState)
}

export const removeAnimation = (uuid: string) => {
  const nextState = getDatabaseAnimations().filter(x => x.uuid != uuid)
  setDatabaseAnimations(nextState)
}
