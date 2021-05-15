import { IEventAction } from "src/ts/editor/interfaces/IEventAction";
import { Character } from "../characters/character";

export abstract class Dispatcher {

  public abstract dispatch: (payload: IEventAction, player: Character) => Promise<any>;

}
