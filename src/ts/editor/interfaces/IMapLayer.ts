import { Vector3 } from "three";
import { IMapEvent } from "./IMapEvent";
import { IMapGround } from "./IMapGround";

export interface IMapLayer {
  grounds: IMapGround[];
  events: IMapEvent[];
  startingPosition?: Vector3;
}
