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

  public onMouseDown: (mouseEvent?: MouseEvent) => void;
  public onMouseUp: () => void;
  public onDoubleClick: (mouseEvent: MouseEvent) => void;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown)  
    window.addEventListener('keyup', this.handleKeyUp)  

    window.addEventListener('mousedown', (mouseEvent) => {
      if (this.onMouseDown) {
        this.onMouseDown(mouseEvent)
      }
    })

    window.addEventListener('mouseup', () => {
      if (this.onMouseUp) {
        this.onMouseUp()
      }
    })

    window.addEventListener('dblclick', (mouseEvent) => {
      if (this.onDoubleClick) {
        this.onDoubleClick(mouseEvent)
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
