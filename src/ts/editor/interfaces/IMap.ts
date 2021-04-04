import { Material, Vector3 } from "three";

export interface IMap {
  uuid: string;

  name: string;

  layers: IMapLayer[];

  children?: IMap[];
}

export interface IMapLayer {
  grounds: IGround[];
}

export interface IGround {
  position: Vector3;
  material: Material;
}
