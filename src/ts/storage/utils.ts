import shortid = require("shortid")
import { EntityType } from "../editor/enums/EntityType"
import { DatabaseActorsStorage, MapStorage, EntitiesStorage } from "./"
import { getResources, setResources } from "./resources"

export function saveToStorage<T>(key: string, payload: T) {
  window.localStorage.setItem(key, JSON.stringify(payload))
}

export function getFromStorage<T>(key: string): T {
  return JSON.parse(window.localStorage.getItem(key))
}

export const initializeStore = () => {

  if (EntitiesStorage.get() == null) {
    EntitiesStorage.set([
      {
        uuid: shortid.generate(),
        name: 'Grass',
        graphicUuid: 'grass',
        category: EntityType.Ground,
      },
      {
        uuid: shortid.generate(),
        name: 'Stone',
        graphicUuid: 'stone',
        category: EntityType.Ground,
      },
      {
        uuid: shortid.generate(),
        name: 'Dirt',
        graphicUuid: 'dirt',
        category: EntityType.Ground,
      },
    ])
  }

  if (EntitiesStorage.getCurrentMode() == null) {
    EntitiesStorage.setCurrentMode(EntityType.Ground)
  }

  if (EntitiesStorage.getCurrentEntity() == null) {
    EntitiesStorage.setCurrentEntity(EntitiesStorage.get()?.[0]?.uuid)
  }

  if (MapStorage.get() == null) {
    MapStorage.set([{
      uuid: shortid.generate(),
      name: 'Map',
      grounds: [],
      events: [],
      settings: {
        width: 20,
        depth: 20,
        skyboxColor: '#FFF',
        ambientLightColor: '#FFF',
      },
    }])
  }

  if (getResources() == null) {
    setResources({
      characters: [
        {
          uuid: 'Ninja',
          displayName: 'Ninja',
          downloadUrl: 'build/assets/models/ninja',
          animationClips: [
            {
              uuid: 'Idle',
              name: 'Idle',
              animationClipPath: 'build/assets/animations/ninja/idle',
            },
            {
              uuid: 'Falling',
              name: 'Falling',
              animationClipPath: 'build/assets/animations/ninja/falling',
            },
            {
              uuid: 'Sprint',
              name: 'Sprint',
              animationClipPath: 'build/assets/animations/ninja/sprint',
            },
            {
              uuid: 'Walk',
              name: 'Walk',
              animationClipPath: 'build/assets/animations/ninja/walk',
            },
            {
              uuid: 'JumpIdle',
              name: 'JumpIdle',
              animationClipPath: 'build/assets/animations/ninja/jump_idle',
            },
            {
              uuid: 'JumpRunning',
              name: 'JumpRunning',
              animationClipPath: 'build/assets/animations/ninja/jump_running',
            },
            {
              uuid: 'Landing',
              name: 'Landing',
              animationClipPath: 'build/assets/animations/ninja/landing',
            },
          ],
          scale: 0.006,
        }
      ],
      props: [],
      textures: [
        {
          uuid: 'grass',
          displayName: 'Grass',
          downloadUrl: 'build/assets/textures/grass.jpeg',
        },
        {
          uuid: 'dirt',
          displayName: 'Dirt',
          downloadUrl: 'build/assets/textures/dirt.png',
        },
        {
          uuid: 'stone',
          displayName: 'Stone',
          downloadUrl: 'build/assets/textures/stone.jpg',
        },
      ],
      fx: [],
      bgm: [],
      se: [],
    })
  }

  if (DatabaseActorsStorage.get() == null) {
    DatabaseActorsStorage.set([{
      uuid: 'Alex',
      name: 'Alex',
      graphicUuid: 'Ninja'
    }])
  }
}
