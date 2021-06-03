import { Vector3 } from "three";
import { IMapEvent } from "./IMapEvent";
import { IMapGround } from "./IMapGround";
import { IMapSettings } from "./IMapSettings";

export interface IMap {
  uuid: string;

  name: string;

  grounds: IMapGround[];

  events: IMapEvent[];

  startingPosition?: Vector3;

  parentUuid?: string;

  settings: IMapSettings | null
}
