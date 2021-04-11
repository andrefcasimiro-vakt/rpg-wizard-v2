import { World } from "../entities/world";
import { IUpdatable } from "./IUpdatable";

export interface IWorldEntity extends IUpdatable {
  entityType: 'character'
  addToWorld: (world: World) => void
  removeFromWorld: (world: World) => void
}
