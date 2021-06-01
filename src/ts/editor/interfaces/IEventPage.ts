import { EventTrigger } from "../enums/EventTrigger";
import { IEventAction } from "./IEventAction";
import { ISwitch } from "./ISwitch";

export interface IEventPage {
  uuid: string;

  switches: ISwitch[];

  actions: IEventAction[];

  trigger: EventTrigger;

  graphicUuid: string | null;
}
