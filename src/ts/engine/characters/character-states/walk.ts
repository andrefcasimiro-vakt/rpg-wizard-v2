import { Character } from "../character";
import { Idle, CharacterStateBase, EndWalk, Sprint, JumpRunning } from ".";

export class Walk extends CharacterStateBase {
  constructor(character: Character) {
    super(character)

    this.character.setArcadeVelocityTarget(0.8)
    this.playAnimation('run', 0.1)
  }

  update = (timestep: number): void => {
    super.update(timestep)

    this.character.setCameraRelativeOrientationTarget()

    this.fallInAir()
  }

  onInputChange = (): void => {
    super.onInputChange()


    if (this.noDirection()) {
      if (this.character.velocity.length() > 1) {
        this.character.setState(new EndWalk(this.character))
      } else {
        this.character.setState(new Idle(this.character))
      }

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
