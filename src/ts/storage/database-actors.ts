import { IActor } from "../editor/interfaces/IActor"
import { StorageHandler } from "./"

export const KEY = `database_actors`

export const DatabaseActorsStorage = new StorageHandler<IActor>(KEY)
