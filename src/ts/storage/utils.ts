import { getDatabaseAnimations, setDatabaseAnimations } from "./database_animations"
import { getResources, setResources } from "./resources"

export function saveToStorage<T>(key: string, payload: T) {
  window.localStorage.setItem(key, JSON.stringify(payload))
}

export function getFromStorage<T>(key: string): T {
  return JSON.parse(window.localStorage.getItem(key))
}

export const initializeStore = () => {

  if (getDatabaseAnimations() == null) {
    setDatabaseAnimations([
      {
        uuid: 'Idle',
        name: 'Idle',
        animationClipPath: 'build/assets/animations/idle.fbx',
      },
      {
        uuid: 'DropIdle',
        name: 'Drop Idle',
        animationClipPath: 'build/assets/animations/drop_idle.fbx',
      },
      {
        uuid: 'DropRolling',
        name: 'Drop Rolling',
        animationClipPath: 'build/assets/animations/drop_rolling.fbx',
      },
      {
        uuid: 'DropRunning',
        name: 'Falling',
        animationClipPath: 'build/assets/animations/falling.fbx',
      },
      {
        uuid: 'IdleRotateLeft',
        name: 'Idle Rotate Left',
        animationClipPath: 'build/assets/animations/idle_rotate_left.fbx',
      },
      {
        uuid: 'IdleRotateRight',
        name: 'Idle Rotate Right',
        animationClipPath: 'build/assets/animations/idle_rotate_right.fbx',
      },
      {
        uuid: 'JumpIdle',
        name: 'Jump Idle',
        animationClipPath: 'build/assets/animations/jump_idle.fbx',
      },
      {
        uuid: 'JumpRunning',
        name: 'Jump Running',
        animationClipPath: 'build/assets/animations/jump_running.fbx',
      },
      {
        uuid: 'StartWalkingForward',
        name: 'Start Walking Forward',
        animationClipPath: 'build/assets/animations/start_walking_forward.fbx',
      },
      {
        uuid: 'StartWalkingLeft',
        name: 'Start Walking Left',
        animationClipPath: 'build/assets/animations/start_walking_left.fbx',
      },
      {
        uuid: 'StartWalkingRight',
        name: 'Start Walking Right',
        animationClipPath: 'build/assets/animations/start_walking_right.fbx',
      },
      {
        uuid: 'StartWalkingBackLeft',
        name: 'Start Walking Back Left',
        animationClipPath: 'build/assets/animations/start_walking_back_left.fbx',
      },
      {
        uuid: 'StartWalkingBackRight',
        name: 'Start Walking Back Right',
        animationClipPath: 'build/assets/animations/start_walking_back_right.fbx',
      },
      {
        uuid: 'Walk',
        name: 'Walk',
        animationClipPath: 'build/assets/animations/walk.fbx',
      },
      {
        uuid: 'EndWalk',
        name: 'End Walk',
        animationClipPath: 'build/assets/animations/end_walk.fbx',
      },
      {
        uuid: 'Sprint',
        name: 'Sprint',
        animationClipPath: 'build/assets/animations/sprint.fbx',
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

}
