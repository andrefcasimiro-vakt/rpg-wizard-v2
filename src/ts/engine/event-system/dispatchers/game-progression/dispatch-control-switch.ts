import { ControlSwitchPayload } from "src/ts/editor/components/events/action-editor/actions/game-progression/control-switches";
import { ShowMessagePayload } from "src/ts/editor/components/events/action-editor/actions/messages/show-messages";
import { IEventAction } from "src/ts/editor/interfaces/IEventAction";
import { World } from "src/ts/engine/entities/world";
import { Character } from "../../../characters/character";
import { UIDialogueManager } from "../../../ui/ui-dialogue-manager";
import { Dispatcher } from "../../dispatcher";

export class DispatchControlSwitch extends Dispatcher {


  dispatch = (action: IEventAction<ControlSwitchPayload>, player: Character, world: World) => {
    return new Promise((resolve) => { 
      world.gameState.updateSwitchValue(action.payload.switch, action.payload.nextValue)
      
      resolve(true)
    })
  }

}
