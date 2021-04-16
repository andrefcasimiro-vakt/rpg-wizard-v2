import { Material, Vector3 } from "three";
import { IMapLayer } from "./IMapLayer";

export interface IMap {
  uuid: string;

  name: string;

  layers: IMapLayer[];

  /** Is the map a child of another map? */
  parentUuid?: string;
}

