import { IAnimationClip } from "../editor/interfaces/IAnimationClip"
import { StorageHandler } from "./"

export const KEY = `database_animations`

export const DatabaseAnimationsStorage = new StorageHandler<IAnimationClip>(KEY)

