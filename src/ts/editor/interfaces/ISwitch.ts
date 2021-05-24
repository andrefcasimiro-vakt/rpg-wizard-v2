export interface ISwitch {
  uuid: string | null
  name: string | null 

  // Todo: Change to inGameValue since this will be used as in-game engine value
  value: boolean | null
}
