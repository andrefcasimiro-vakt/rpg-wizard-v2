import { IEventAction } from "../../../../editor/interfaces/IEventAction";
import { IEventPage } from "../../../../editor/interfaces/IEventPage";

export class EventActionEditor {
  eventPage: IEventPage

  constructor(eventPage: IEventPage) {
    this.eventPage = eventPage
  }

  onCommitChanges = (payload: IEventAction) => {
    const newState = this.eventPage.actions

    const idx = newState.findIndex(action => action.uuid == payload.uuid)
    if (idx != -1) {
      newState[idx] = payload
    } else {
      newState.push(payload)
    }
  }
}
