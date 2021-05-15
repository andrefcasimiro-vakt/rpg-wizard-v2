import { World } from "../entities/world";
import { IUpdatable } from "./IUpdatable";

export enum EntityType {
  PLAYER = 'PLAYER',
  NPC = 'NPC'
}

export interface IWorldEntity extends IUpdatable {
  entityType: EntityType
  addToWorld: (world: World) => void
  removeFromWorld: (world: World) => void
}
