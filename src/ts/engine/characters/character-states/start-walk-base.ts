import { getSignedAngleBetweenVectors } from "../../utils/function-library";
import { Character } from "../character";
import { Idle, CharacterStateBase, Walk, Sprint, IdleRotateRight, IdleRotateLeft, JumpRunning } from ".";


export class StartWalkBase extends CharacterStateBase {

  constructor(character: Character) {
    super(character)

    this.character.rotationSimulator.mass = 20
    this.character.rotationSimulator.damping = 0.7

    this.character.setArcadeVelocityTarget(0.8)
  }

  update = (timestep: number): void => {
    super.update(timestep)

    if (this.animationHasEnded(timestep)) {
      this.character.setState(new Walk(this.character))
    }

    this.character.setCameraRelativeOrientationTarget()

    this.fallInAir()
  }

  onInputChange = (): void => {
    super.onInputChange()

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpRunning(this.character))
    }

    if (this.noDirection()) {
      if (this.timer < 0.1) {
        let angle = getSignedAngleBetweenVectors(this.character.orientation, this.character.orientationTarget)

        if (angle > Math.PI * 0.4) {
          this.character.setState(new IdleRotateLeft(this.character))
        } else if (angle < -Math.PI * 0.4) {
          this.character.setState(new IdleRotateRight(this.character))
        } else {
          this.character.setState(new Idle(this.character))
        }
      } else {
        this.character.setState(new Idle(this.character))
      }
    }

    if (this.character.actions.run.justPressed) {
      this.character.setState(new Sprint(this.character))
    }
  }

}