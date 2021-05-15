import { ShowMessagePayload } from "src/ts/editor/components/events/actions/messages/show-messages";
import { IEventAction } from "src/ts/editor/interfaces/IEventAction";
import { Character } from "../../characters/character";
import { UIDialogueManager } from "../../ui/ui-dialogue-manager";
import { Dispatcher } from "../dispatcher";

export class DispatchShowMessage extends Dispatcher {

  player: Character
  resolve: any;

  dispatch = (action: IEventAction<ShowMessagePayload>, player: Character) => {
    return new Promise((resolve) => {
      player.disableInput()

      UIDialogueManager.showDialogue(action.payload.actorName, action.payload.message)
  
      this.player = player
      this.resolve = resolve

      window.addEventListener('keydown', this.handleKey, true)
    })
  }

  handleKey = (evt: KeyboardEvent) => {
    console.log(evt)
    if (evt.key == 'e') {
      UIDialogueManager.closeDialogue()

      this.player.enableInput()
      this.resolve()

      window.removeEventListener('keydown', this.handleKey, true)
    }
  }
}
