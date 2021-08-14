import { IEventAction } from "src/ts/editor/interfaces/IEventAction";
import { Character } from "../characters/character";
import { World } from "../entities/world";

export abstract class Dispatcher {
  public abstract dispatch: (
    payload: IEventAction,
    player: Character,
    world?: World
  ) => Promise<any>;

}
