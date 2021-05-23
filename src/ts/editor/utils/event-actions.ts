import { Dispatcher } from "src/ts/engine/event-system/dispatcher";
import { DispatchShowMessage } from "src/ts/engine/event-system/dispatchers/dispatch-show-message";
import { EventActionEditor } from "../components/events/action-editor/actions/event-action-editor";
import { ShowMessages } from "../components/events/action-editor/actions/messages/show-messages"
import { EventActionTypes } from "../enums/EventActionTypes"

export const getEventActionInstance = (type: EventActionTypes): EventActionEditor => {
  switch (type) {
    case EventActionTypes.SHOW_TEXT:
      return new ShowMessages();    
    default:
      return null
  }
}

export const getEventActionDispatcher = (type: EventActionTypes): Dispatcher => {
  switch (type) {
    case EventActionTypes.SHOW_TEXT:
      return new DispatchShowMessage();    
    default:
      return null
  }
}
