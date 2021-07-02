import { IAnimationClip } from "./IAnimationClip";
import { IResourceModel } from "./IResourceModel";

export interface IResourceCharacter extends IResourceModel {
  animationClips: IAnimationClip[]
}
