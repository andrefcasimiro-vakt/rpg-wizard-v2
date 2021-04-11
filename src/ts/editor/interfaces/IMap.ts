import { Material, Vector3 } from "three";

export interface IMap {
  uuid: string;

  name: string;

  layers: IMapLayer[];

  /** Is the map a child of another map? */
  parentUuid?: string;
}

export interface IMapLayer {
  grounds: IMapGround[];
}

export interface IMapGround {
  position: Vector3;
  color: string;
}
