import { IAnimationClip } from "./IAnimationClip";
import { IResource } from "./IResource";

export interface IResourceCharacter extends IResource {
  scale: number

  animationClips: IAnimationClip[]
}
