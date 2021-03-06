import { Character } from "../character";
import { Idle, CharacterStateBase, Sprint, JumpRunning } from ".";
import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";

export class Walk extends CharacterStateBase {
  constructor(character: Character) {
    super(character)

    this.character.setArcadeVelocityTarget(0.5)
    this.playAnimation(DefaultAnimations.Walk, 0.1)
  }

  update = (timestep: number): void => {
    super.update(timestep)

    this.character.setCameraRelativeOrientationTarget()

    this.fallInAir()
  }

  onInputChange = (): void => {
    super.onInputChange()

    if (this.noDirection()) {
      this.character.setState(new Idle(this.character))

      return
    }

    if (this.character.actions.run.isPressed) {
      this.character.setState(new Sprint(this.character))
    }

    if (this.character.actions.run.justPressed) {
      this.character.setState(new Sprint(this.character))
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpRunning(this.character))
    }
  }
}
