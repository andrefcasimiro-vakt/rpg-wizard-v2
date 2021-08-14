import shortid = require("shortid");
import { EventTrigger } from "src/ts/editor/enums/EventTrigger";
import { IEvent } from "src/ts/editor/interfaces/IEvent";
import { IEventPage } from "src/ts/editor/interfaces/IEventPage";
import { IResourceCharacter } from "src/ts/editor/interfaces/IResourceCharacter";
import { getEventActionDispatcher } from "src/ts/editor/utils/event-actions";
import { getEventByUuid } from "src/ts/storage/events";
import { getResources } from "src/ts/storage/resources";
import { Vector3 } from "three";
import { Group } from "three/src/objects/Group";
import { Character } from "../characters/character";
import { LoadingManager } from "../core/loading-manager";
import { World } from "../entities/world";
import { IGameStateSubscriber } from "../interfaces/IGameStateSubscriber";
import { IUpdatable } from "../interfaces/IUpdatable";
import { WorldEntityType } from "../interfaces/IWorldEntity";

export class Event implements IUpdatable, IGameStateSubscriber {

  subscriptionUuid = shortid.generate()
  updateOrder = 1;
  event: IEvent
  eventPosition: Vector3
  world: World
  player: Character
  isEnabled: boolean = true
  loadingManager: LoadingManager
  activePage: IEventPage
  pageCharacter: Character
  lastActiveCharacterGraphicUuid: string
  previousPlayerPosition: Vector3

  constructor(world: World, eventPositon: Vector3, eventUuid: string) {
    this.world = world
    this.eventPosition = eventPositon

    this.world.registerUpdatable(this)
    this.event = getEventByUuid(eventUuid)
    
    this.loadingManager = new LoadingManager(this.world)
    
    this.setupEvent()

    this.world.gameState.subscribe(this)
  }

  setupEvent = () => {
    this.setupActivePage()
    this.setupGraphic()

    if (this.activePage.trigger === EventTrigger.AUTOMATIC || this.activePage.trigger  === EventTrigger.PARALLEL_PROCESS) {
      this.dispatch()
    }
  }

  setupActivePage = () => {
    // Find last
    this.activePage = this.event.eventPages.slice().reverse().find(page => {
      return page.switches.length && page.switches.every(pageSwitch =>
        this.world.gameState.getSwitch(pageSwitch.uuid)?.value == true
      )
    })

    if (!this.activePage) {
      // Get first page
      this.activePage = this.event.eventPages[0]
    }
  }

  setupGraphic = () => {
    if (!this.activePage.graphicUuid) {
      return
    }

    // Dont download the same model if already on scene
    if (this.activePage.graphicUuid == this.lastActiveCharacterGraphicUuid) {
      return
    }

    const resource = getResources().characters.find(x => x.uuid == this.activePage.graphicUuid) as IResourceCharacter
    if (!resource) {
      return
    }

    this.world.remove(this.pageCharacter)

    this.loadingManager.loadFbx(resource.downloadUrl, (model: Group) => {
      model.scale.setScalar(resource.scale)
      this.pageCharacter = new Character(model, resource.animationClips, this.world)
      this.pageCharacter.setPosition(this.eventPosition.x, this.eventPosition.y + 1, this.eventPosition.z)
      this.world.add(this.pageCharacter)
      this.lastActiveCharacterGraphicUuid = resource.uuid
    })
  }

  update = () => {
    // Dont handle any logic if automatic or parallel processing since this is done on the setup
    if (this.activePage.trigger  == EventTrigger.AUTOMATIC || this.activePage.trigger  == EventTrigger.PARALLEL_PROCESS) {
      return
    }

    if (this.player == null) {
      this.player = this.world.characters.find(char => char.entityType == WorldEntityType.PLAYER)
    }

    const eventPosition = this.pageCharacter?.position
      ? this.pageCharacter?.position.clone()
      : this.eventPosition

    const isPlayerPositionSameAsEvent = this?.player?.position.clone()?.round()?.equals(eventPosition?.round())

    if (this.isEnabled == false) {
      return
    }

    const isCollisionDependant =
      this.activePage.trigger  == EventTrigger.ON_PLAYER_TOUCH
      || this.activePage.trigger  == EventTrigger.ON_EVENT_TOUCH_PLAYER

    if (isPlayerPositionSameAsEvent) {
      if (isCollisionDependant || this.world.inputManager.keyPressed?.code === 'KeyE') {
        this.isEnabled = false
        this.previousPlayerPosition = this.player.position.clone()
        this.dispatch()
      }
    }
  }

  dispatch = async () => {    
    const promises = this.activePage.actions.map(action => {
      return () => getEventActionDispatcher(action.type).dispatch(action, this.player, this.world)
    })

    for (let promise of promises) {
      await promise()
    }

    // Repeat if parallel process
    if (this.activePage.trigger  == EventTrigger.PARALLEL_PROCESS) {
      this.dispatch()
    }

    setTimeout(() => { this.isEnabled = true }, 1000)
  }

  onGameStateUpdate = () => {
    this.setupEvent()
  }
}
