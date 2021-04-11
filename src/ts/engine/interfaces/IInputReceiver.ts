import { KeyBinding } from "../core/key-binding";

export interface IInputAction { [actionName: string]: KeyBinding }
export interface IInputReceiver {
  actions: IInputAction

  handleKeyboardEvent: (event: KeyboardEvent, code: string, pressed: boolean) => void;
  handleMouseButton: (event: MouseEvent, code: string, pressed: boolean) => void;
  handleMouseMove: (event: MouseEvent, deltaX: number, deltaY: number) => void;
  handleMouseWheel: (event: WheelEvent, value: number) => void;

  inputReceiverInit: () => void;
  inputReceiverUpdate: (timestep: number) => void;
}
