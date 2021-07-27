import { World } from "../entities/world";
import { IUpdatable } from "./IUpdatable";

export enum WorldEntityType {
  PLAYER = 'PLAYER',
  NPC = 'NPC'
}

export interface IWorldEntity extends IUpdatable {
  entityType: WorldEntityType
  addToWorld: (world: World) => void
  removeFromWorld: (world: World) => void
}
