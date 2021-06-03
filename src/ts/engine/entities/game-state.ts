import { ISwitch } from "src/ts/editor/interfaces/ISwitch"
import { getGameState, setGameState } from "src/ts/storage/game-state"
import { Event } from "../event-system/event"
import { IGameState } from "../interfaces/IGameState"
import { IGameStateSubscriber } from "../interfaces/IGameStateSubscriber"

const defaultState: IGameState = {
  switches: [],
}
export class GameState {

  state: IGameState

  subscribers: IGameStateSubscriber[] = []

  constructor() {
    this.loadState()
  }

  subscribe = (subscriber: IGameStateSubscriber) => {
    this.subscribers.push(subscriber)
  }

  unsubscribe = (unsubscriber: IGameStateSubscriber) => {
    this.subscribers = this.subscribers.filter(x => x.subscriptionUuid !== unsubscriber.subscriptionUuid)
  }

  notify = () => {
    this.subscribers.forEach(subscriber => {
      subscriber.onGameStateUpdate()
    })
  }

  getSwitch = (switchUuid): ISwitch => {
    return this.state.switches.find(x => x.uuid == switchUuid)
  }

  updateSwitchValue = (payload: ISwitch, value: boolean) => {
    const idx = this.state.switches.findIndex(x => x.uuid == payload.uuid)

    if (idx == -1) {
      this.state.switches.push({...payload, value })
    } else {
      this.state.switches[idx].value = value
    }

    this.notify()
  }

  saveState = () => {
    setGameState(this.state)
  }

  loadState = () => {
    const loadedState = getGameState() || defaultState

    this.state = loadedState
  }
}
