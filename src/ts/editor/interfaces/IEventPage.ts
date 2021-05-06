import { IEventBase } from "./IEvent";

export interface IEventPage {
  uuid: string;

  switchId: string | null;

  events: IEventBase[];
}
