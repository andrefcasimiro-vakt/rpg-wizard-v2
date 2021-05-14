import { IEventAction } from "./IEventAction";

export interface IEventPage {
  uuid: string;

  pageIndex: number;

  switchId: string | null;

  actions: IEventAction[];
}
