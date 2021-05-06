import { World } from "../entities/world";
import { IInputReceiver } from "../interfaces/IInputReceiver";
import { IUpdatable } from "../interfaces/IUpdatable";

export class InputManager implements IUpdatable {

  public updateOrder = 3

  public world: World
  public domElement: HTMLElement
  public pointerLock: any
  public isLocked: boolean
  public inputReceiver: IInputReceiver

  public boundOnMouseDown: (evt: MouseEvent) => void;
  public boundOnMouseMove: (evt: MouseEvent) => void;
  public boundOnMouseUp: (evt: MouseEvent) => void;
  public boundOnMouseWheelMove: (evt: WheelEvent) => void;
  public boundOnPointerlockChange: (evt: MouseEvent) => void;
  public boundOnPointerlockError: (evt: MouseEvent) => void;
  public boundOnKeyDown: (evt: KeyboardEvent) => void;
  public boundOnKeyUp: (evt: KeyboardEvent) => void;


  constructor(world: World, domElement: HTMLElement) {
    this.world = world
    this.pointerLock = true // world.params?.Pointer_Lock
    this.domElement = domElement || document.body
    this.isLocked = false

    this.boundOnMouseDown = this.onMouseDown
    this.boundOnMouseMove = this.onMouseMove
    this.boundOnMouseUp = this.onMouseUp
    this.boundOnPointerlockChange = this.onPointerlockChange
    this.boundOnPointerlockError = this.onPointerlockError
    this.boundOnKeyDown = this.onKeyDown
    this.boundOnKeyUp = this.onKeyUp

    this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false)
    document.addEventListener('wheel', this.boundOnMouseWheelMove, false)
    document.addEventListener('pointerlockchange', this.boundOnPointerlockChange, false)
    document.addEventListener('pointerlockerror', this.boundOnPointerlockError, false)
    document.addEventListener('keydown', this.boundOnKeyDown, false)
    document.addEventListener('keyup', this.boundOnKeyUp, false)
  
    world.registerUpdatable(this)
  }

  update = (timestep: number, unscaledTimestep: number) => {
    if (
      this.inputReceiver === undefined
      && this.world !== undefined
      && this.world.cameraOperator !== undefined
    ) {
      this.setInputReceiver(this.world.cameraOperator)
    }

    this.inputReceiver?.inputReceiverUpdate(unscaledTimestep)
  }

  setInputReceiver = (receiver: IInputReceiver) => {
    this.inputReceiver = receiver
    this.inputReceiver.inputReceiverInit()
  }

  setPointerLock = (enabled: boolean) => {
    this.pointerLock = enabled
  }

  onPointerlockChange = (event: MouseEvent) => {
    if (document.pointerLockElement == this.domElement) {
      this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false)
      this.isLocked = true
      return;
    }

    this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false)
    this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false)
    this.isLocked = false
  }

  onPointerlockError = (event: MouseEvent) => {
    if (this.pointerLock) {
      console.error(`PointerLockControls: Unable to use pointer lock API`)
    }
  }

  onMouseDown = (event: MouseEvent) => {
    if (this.pointerLock) {
      this.domElement.requestPointerLock()
    } else {
      this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false)
    }

    if (this.inputReceiver) {
      this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, true)
    }
  }

  onMouseMove = (event: MouseEvent) => {
    if (this.inputReceiver) {
      this.inputReceiver.handleMouseMove(event, event.movementX, event.movementY)
    }
  }

  onMouseUp = (event: MouseEvent) => {
    if (!this.pointerLock) {
      this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false)
    }

    if (this.inputReceiver) {
      this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, false)
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.inputReceiver) {
      this.inputReceiver.handleKeyboardEvent(event, event.code, true)
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (this.inputReceiver) {
      this.inputReceiver.handleKeyboardEvent(event, event.code, false)
    }
  }

  onMouseWheelMove = (event: WheelEvent) => {
    if (this.inputReceiver) {
      this.inputReceiver.handleMouseWheel(event, event.deltaY)
    }
  }
}
