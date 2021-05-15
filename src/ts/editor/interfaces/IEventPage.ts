import { IEventAction } from "./IEventAction";

export interface IEventPage {
  uuid: string;

  switchId: string | null;

  actions: IEventAction[];
}
