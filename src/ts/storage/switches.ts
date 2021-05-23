import { ISwitch } from "../editor/interfaces/ISwitch";

export const SWITCHES_LIST_KEY = `switches`

export const getSwitches = (): ISwitch[] => {
  return JSON.parse(window.localStorage.getItem(SWITCHES_LIST_KEY)) || []
}

export const setSwitches = (payload: ISwitch[]) => {
  window.localStorage.setItem(SWITCHES_LIST_KEY, JSON.stringify(payload))
}
