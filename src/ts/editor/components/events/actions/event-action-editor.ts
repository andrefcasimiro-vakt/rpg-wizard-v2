import { addOrUpdateEvent, getCurrentEvent, getCurrentEventPageUuid } from "../../../../storage/events";
import { IEventAction } from "../../../../editor/interfaces/IEventAction";

export abstract class EventActionEditor {

  abstract open: () => void;

  onCommitChanges = (payload: IEventAction) => {
    const pageUuid = getCurrentEventPageUuid()
    const event = getCurrentEvent()

    event.eventPages.forEach(eventPage => {
      if (eventPage.uuid == pageUuid) {
        const actionIdx = eventPage.actions.findIndex(x => x.uuid == payload.uuid)
        if (actionIdx != -1) {
          eventPage.actions[actionIdx] = payload
        } else {
          eventPage.actions.push(payload)
        }
      }
    })

    addOrUpdateEvent(event)
  }
}
