import { IAnimationClip } from "./IAnimationClip";
import { IResource } from "./IResource";

export interface IResourceCharacter extends IResource {
  animations: IAnimationClip[]
}
