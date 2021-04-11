import { IMap } from "./IMap";

export interface IProject {
  uuid: string
  name: string
  maps: IMap[]
}
