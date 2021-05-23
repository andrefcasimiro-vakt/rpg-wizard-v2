import { IEvent } from "../editor/interfaces/IEvent"

export const CURRENT_EVENT_UUID_KEY = `currentEventUuid`

export const CURRENT_EVENT_PAGE_UUID_KEY = `currentEventPageUuid`

export const EVENTS_LIST_KEY = `events`

export const setCurrentEventPageUuid = (pageUuid: string): void => {
  window.localStorage.setItem(CURRENT_EVENT_PAGE_UUID_KEY, pageUuid)
}

export const getCurrentEventPageUuid = (): string => {
  return window.localStorage.getItem(CURRENT_EVENT_PAGE_UUID_KEY)
}

// For the current event being edited

export const setCurrentEventUuid = (eventUuid: string) => {
  window.localStorage.setItem(CURRENT_EVENT_UUID_KEY, eventUuid)
}

export const getCurrentEventUuid = (): string => {
  return window.localStorage.getItem(CURRENT_EVENT_UUID_KEY)
}

export const getCurrentEvent = (): IEvent => {
  const eventUuid = getCurrentEventUuid()

  if (!eventUuid) {
    return null
  }

  return getEventByUuid(eventUuid)
}

// List of all events 

export const setEvents = (events: IEvent[]): void => {
  window.localStorage.setItem(EVENTS_LIST_KEY, JSON.stringify(events))
}

export const addOrUpdateEvent = (event: IEvent): void => {
  const events = getEvents() || []

  const idx = events.findIndex(e => e.uuid == event.uuid)
  if (idx != -1) {
    events[idx] = event
  } else {
    events.push(event)
  }

  setEvents(events)
}

export const getEvents = (): IEvent[] => {
  return JSON.parse(window.localStorage.getItem(EVENTS_LIST_KEY))
}

export const getEventByUuid = (uuid: string): IEvent => {
  return getEvents()?.find(event => event.uuid == uuid)
}
