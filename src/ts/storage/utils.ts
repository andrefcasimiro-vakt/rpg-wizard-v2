import { DatabaseActorsStorage, DatabaseAnimationsStorage } from "./"
import { getResources, setResources } from "./resources"

export function saveToStorage<T>(key: string, payload: T) {
  window.localStorage.setItem(key, JSON.stringify(payload))
}

export function getFromStorage<T>(key: string): T {
  return JSON.parse(window.localStorage.getItem(key))
}

export const initializeStore = () => {

  if (DatabaseAnimationsStorage.get() == null) {
    DatabaseAnimationsStorage.set([
      {
        uuid: 'Idle',
        name: 'Idle',
        animationClipPath: 'build/assets/animations/idle',
      },
      {
        uuid: 'DropIdle',
        name: 'Drop Idle',
        animationClipPath: 'build/assets/animations/drop_idle',
      },
      {
        uuid: 'DropRolling',
        name: 'Drop Rolling',
        animationClipPath: 'build/assets/animations/drop_rolling',
      },
      {
        uuid: 'DropRunning',
        name: 'Falling',
        animationClipPath: 'build/assets/animations/falling',
      },
      {
        uuid: 'IdleRotateLeft',
        name: 'Idle Rotate Left',
        animationClipPath: 'build/assets/animations/idle_rotate_left',
      },
      {
        uuid: 'IdleRotateRight',
        name: 'Idle Rotate Right',
        animationClipPath: 'build/assets/animations/idle_rotate_right',
      },
      {
        uuid: 'JumpIdle',
        name: 'Jump Idle',
        animationClipPath: 'build/assets/animations/jump_idle',
      },
      {
        uuid: 'JumpRunning',
        name: 'Jump Running',
        animationClipPath: 'build/assets/animations/jump_running',
      },
      // {
      //   uuid: 'StartWalkingForward',
      //   name: 'Start Walking Forward',
      //   animationClipPath: 'build/assets/animations/start_walking_forward',
      // },
      // {
      //   uuid: 'StartWalkingLeft',
      //   name: 'Start Walking Left',
      //   animationClipPath: 'build/assets/animations/start_walking_left',
      // },
      // {
      //   uuid: 'StartWalkingRight',
      //   name: 'Start Walking Right',
      //   animationClipPath: 'build/assets/animations/start_walking_right',
      // },
      // {
      //   uuid: 'StartWalkingBackLeft',
      //   name: 'Start Walking Back Left',
      //   animationClipPath: 'build/assets/animations/start_walking_back_left',
      // },
      // {
      //   uuid: 'StartWalkingBackRight',
      //   name: 'Start Walking Back Right',
      //   animationClipPath: 'build/assets/animations/start_walking_back_right',
      // },
      {
        uuid: 'Walk',
        name: 'Walk',
        animationClipPath: 'build/assets/animations/walk',
      },
      // {
      //   uuid: 'EndWalk',
      //   name: 'End Walk',
      //   animationClipPath: 'build/assets/animations/end_walk',
      // },
      {
        uuid: 'Sprint',
        name: 'Sprint',
        animationClipPath: 'build/assets/animations/sprint',
      },
    ])
  }

  if (getResources() == null) {
    setResources({
      characters: [],
      props: [],
      textures: [],
      fx: [],
      bgm: [],
      se: [],
    })
  }

  if (DatabaseActorsStorage.get() == null) {
    DatabaseActorsStorage.set([{
      uuid: 'Alex',
      name: 'Alex',
      graphicUuid: 'Alex'
    }])
  }
}
