import { Character } from "../characters/character";

export interface ICharacterAI {
  character: Character
  update(timeStep: number): void
}
