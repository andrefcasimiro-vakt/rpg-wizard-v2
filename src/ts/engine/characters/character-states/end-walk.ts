import { Character } from "../character";
import { Idle, Walk, CharacterStateBase, JumpIdle, Sprint } from ".";

export class EndWalk extends CharacterStateBase {
  constructor(character: Character) {
    super(character)

    this.character.setArcadeVelocityTarget(0)

    this.playAnimation('stop', 0.1)
  }

  public update(timestep: number): void {
    super.update(timestep)

    if (this.animationHasEnded(timestep)) {
      this.character.setState(new Idle(this.character))
    }

    this.fallInAir()
  }

  onInputChange = (): void => {
    super.onInputChange()

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpIdle(this.character))
    }

    if (this.anyDirection()) {
      if (this.character.actions.run.isPressed) {
        this.character.setState(new Sprint(this.character))
      } else {
        if (this.character.velocity.length() > 0.5) {
          this.character.setState(new Walk(this.character))
        } else {
          this.setAppropriateStartWalkState()
        }
      }
    }
  }
}
