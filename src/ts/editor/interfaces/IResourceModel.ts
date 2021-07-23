import { IResourceMaterial } from "src/ts/editor/interfaces/IResourceMaterial";
import { IResource } from "./IResource";

export interface IResourceModel extends IResource {
  scale: number

  materials: IResourceMaterial[]
}
