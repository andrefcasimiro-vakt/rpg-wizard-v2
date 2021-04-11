import _ = require("lodash")

export class InputManager {
  _pressedKeys: string[] = []

  public get pressedKeys() {
    return this._pressedKeys
  }

  public set pressedKeys(value: string[]) {
    this._pressedKeys = value

    if (this.onKeyPressedChange) {
      this.onKeyPressedChange(value)
    }
  }

  public onKeyPressedChange: (pressedKeys: string[]) => void;

  public onMouseClick: () => void;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown)  
    window.addEventListener('keyup', this.handleKeyUp)  

    window.addEventListener('mousedown', () => {
      if (this.onMouseClick) {
        this.onMouseClick()
      }
    })
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const newState = this.pressedKeys.slice()
    newState.push(event.code)

    this.pressedKeys = newState
  }

  handleKeyUp = (event: KeyboardEvent) => {
    const newState = _.pull(this.pressedKeys, event.code)

    this.pressedKeys = newState
  }
}
