import { IEventPage } from "./IEventPage";

export interface IEvent {
  uuid: string

  eventPages: IEventPage[]
}
