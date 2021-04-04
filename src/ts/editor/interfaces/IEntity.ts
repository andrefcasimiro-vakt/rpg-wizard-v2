export interface IEntity {
  uuid: string
  name: string 
}

export interface IGround extends IEntity {
  color?: string
}
