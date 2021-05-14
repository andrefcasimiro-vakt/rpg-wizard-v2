import shortid = require("shortid");
import { IEventAction } from "src/ts/editor/interfaces/IEventAction";
import { EventActionEditor } from "../event-action-editor";

export interface IShowMessage {
  actorName: string;
  messages: string[];
}

export class ShowMessages extends EventActionEditor {
  eventAction: IEventAction<IShowMessage>

  payload: IShowMessage

  constructor(eventPage) {
    super(eventPage)
  }

  onCommitChanges = () => {
    super.onCommitChanges(this.eventAction)

    this.eventAction.uuid = shortid.generate()
    this.eventAction.payload = this.payload

  }
}
