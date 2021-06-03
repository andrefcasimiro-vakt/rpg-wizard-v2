import { EntityType } from "../enums/EntityType";

export interface IEntity {
  uuid: string
  name: string 
  graphicUuid: string
  category: EntityType
}

export interface IGround extends IEntity {}
