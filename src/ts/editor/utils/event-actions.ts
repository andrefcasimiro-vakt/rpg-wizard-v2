import { Dispatcher } from "src/ts/engine/event-system/dispatcher";
import { DispatchControlSwitch } from "src/ts/engine/event-system/dispatchers/game-progression/dispatch-control-switch";
import { DispatchShowMessage } from "src/ts/engine/event-system/dispatchers/messages/dispatch-show-message";
import { EventActionEditor } from "../components/events/action-editor/actions/event-action-editor";
import { ControlSwitches } from "../components/events/action-editor/actions/game-progression/control-switches";
import { ShowMessages } from "../components/events/action-editor/actions/messages/show-messages"
import { EventActionTypes } from "../enums/EventActionTypes"

export const getEventActionInstance = (type: EventActionTypes): EventActionEditor => {
  switch (type) {
    case EventActionTypes.SHOW_TEXT:
      return new ShowMessages();    
    case EventActionTypes.CONTROL_SWITCHES:
      return new ControlSwitches();
    default:
      return null
  }
}

export const getEventActionDispatcher = (type: EventActionTypes): Dispatcher => {
  switch (type) {
    case EventActionTypes.SHOW_TEXT:
      return new DispatchShowMessage();   
    
    case EventActionTypes.CONTROL_SWITCHES: 
      return new DispatchControlSwitch();
    default:
      return null
  }
}
