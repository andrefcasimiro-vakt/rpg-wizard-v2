import { EventActionTypes } from "../enums/EventActionTypes";

export interface IEventAction<T = any> {
  uuid: string;

  type: EventActionTypes

  payload: T
}
