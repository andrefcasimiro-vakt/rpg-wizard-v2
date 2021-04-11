export class KeyBinding {
  public eventCodes: string[]
  public isPressed: boolean
  public justPressed: boolean
  public justReleased: boolean

  constructor(...eventCodes: string[]) {
    this.eventCodes = eventCodes
  }
}
