import { IResource } from "./IResource";
import { IResourceMaterial } from "./IResourceMaterial";
export interface IResourceModel extends IResource {
  scale: number

  materials: IResourceMaterial[]
}
