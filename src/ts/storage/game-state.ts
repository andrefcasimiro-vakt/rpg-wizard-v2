import { IGameState } from "../engine/interfaces/IGameState"

export const GAME_STATE_KEY = `gameState`

export const getGameState = (): IGameState => {
  return JSON.parse(window.localStorage.getItem(GAME_STATE_KEY))
}

export const setGameState = (payload: IGameState) => {
  window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(payload))
}
