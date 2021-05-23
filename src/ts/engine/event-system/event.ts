import { EventTrigger } from "src/ts/editor/enums/EventTrigger";
import { IEvent } from "src/ts/editor/interfaces/IEvent";
import { getEventActionDispatcher } from "src/ts/editor/utils/event-actions";
import { getEventByUuid } from "src/ts/storage/events";
import { Vector3 } from "three";
import { Character } from "../characters/character";
import { World } from "../entities/world";
import { IUpdatable } from "../interfaces/IUpdatable";
import { EntityType } from "../interfaces/IWorldEntity";


export class Event implements IUpdatable {
  updateOrder = 1;
  
  // This will move to be inside event
  trigger: EventTrigger = EventTrigger.ON_PLAYER_TOUCH

  // Event
  event: IEvent

  eventPosition: Vector3

  world: World

  player: Character

  enabled: boolean = true

  constructor(world: World, eventPositon: Vector3, eventUuid: string) {
    this.world = world
    this.eventPosition = eventPositon

    this.world.registerUpdatable(this)
    this.event = getEventByUuid(eventUuid)
  }

  update = () => {
    if (this.player == null) {
      this.player = this.world.characters.find(char => char.entityType == EntityType.PLAYER)
    }

    const isPlayerPositionSameAsEvent = this?.player?.position.clone()?.round()?.equals(this.eventPosition)

    if (this.enabled == false && !isPlayerPositionSameAsEvent) {
      // If player has moved away after event has played, reset the event
      this.enabled = true
    }

    if (isPlayerPositionSameAsEvent) {
      if (this.trigger == EventTrigger.ON_PLAYER_TOUCH && this.enabled) {
        this.dispatch()
        this.enabled = false
      }
    }
  }

  dispatch = async () => {
    // Get the first page where all switches are active

    // Find last
    var page = this.event.eventPages.slice().reverse().find(page => {
      return page.switches.length && page.switches.every(pageSwitch =>
        this.world.gameState.getSwitch(pageSwitch.uuid)?.value == true
      )
    })

    if (!page) {
      // Get first page
      page = this.event.eventPages[0]
    }

    const promises = page.actions.map(action => {
      return () => getEventActionDispatcher(action.type).dispatch(action, this.player, this.world)
    })

    for (let promise of promises) {
      await promise()
    }
  }
}
