import { addOrUpdateEvent, getCurrentEvent, getCurrentEventPageUuid } from "../../../../storage/events";
import { IEventAction } from "../../../../editor/interfaces/IEventAction";

export abstract class EventActionEditor {

  public onChangesCommited: () => void;

  abstract open: () => void;

  abstract update: (action: IEventAction) => void;

  onCommitChanges = (action: IEventAction) => {
    const pageUuid = getCurrentEventPageUuid()
    const event = getCurrentEvent()

    event.eventPages.forEach(eventPage => {
      if (eventPage.uuid == pageUuid) {
        const actionIdx = eventPage.actions.findIndex(x => x.uuid == action.uuid)
        if (actionIdx != -1) {
          eventPage.actions[actionIdx] = action
        } else {
          eventPage.actions.push(action)
        }
      }
    })

    addOrUpdateEvent(event)

    if (this.onChangesCommited) {
      this.onChangesCommited()
    }
  }
}
