import { ICharacterState } from "../../interfaces/ICharacterState";
import { getSignedAngleBetweenVectors } from "../../utils/function-library";
import { Character } from "../character";

export abstract class CharacterStateBase implements ICharacterState {
  public character: Character
  public timer: number
  public animationLength: any
  
  constructor(character: Character) {
    this.character = character

    this.character.velocitySimulator.damping = this.character.defaultVelocitySimulatorDamping
    this.character.velocitySimulator.mass = this.character.defaultVelocitySimulatorMass
    this.character.rotationSimulator.damping = this.character.defaultRotationSimulatorDamping
    this.character.rotationSimulator.mass = this.character.defaultRotationSimulatorMass

    this.character.arcadeVelocityIsAdditive = false
    this.character.setArcadeVelocityInfluence(1, 0, 1)

    this.timer = 0
  }

  public update(timeStep: number) {
    this.timer += timeStep
  }

  public onInputChange() {
    console.log('hjey')
  }

  noDirection = (): boolean =>
    (this.character.actions.up.isPressed === false
    && this.character.actions.down.isPressed === false
    && this.character.actions.left.isPressed === false
    && this.character.actions.right.isPressed === false)

  anyDirection = (): boolean =>
    (this.character.actions.up.isPressed === true
      || this.character.actions.down.isPressed === true
      || this.character.actions.left.isPressed === true
      || this.character.actions.right.isPressed === true)

  fallInAir = (): void => {
    if (!this.character.rayWasHit) {
      // this.character.setState(
      //   new Falling(this.character)
      // )
    }
  }

  animationHasEnded = (timeStep: number): boolean => {
    if (this.character.mixer === undefined) {
      return true
    }

    if (!this.animationLength) {
      return false
    }

    return this.timer > this.animationLength - timeStep
  }

  setAppropriateDropState = () => {
    if (this.character.groundImpactData.velocity.y < -6) {
      // this.character.setState(new DropRolling(this.character))
    } else if (this.anyDirection()) {
      if (this.character.groundImpactData.velocity.y < -2) {
      // this.character.setState(new DropRunning(this.character))
      } else {

        if (this.character.actions.run.isPressed) {
          // this.character.setState(new Sprint(this.character))
        } else {
          // this.character.setState(new Walk(this.character))
        }

      }
    } else {
     //this.character.setState(new DropIdle(this.character))
    }
  }

  setAppropriateStartWalkState = (): void => {
    let range = Math.PI
    let angle = getSignedAngleBetweenVectors(this.character.orientation, this.character.getCameraRelativeMovementVector())

    if (angle > range * 0.8) {
      // this.character.setState(new StartWalkBackLeft(this.character))
    } else if (angle < -range * 0.8) {
      // this.character.setState(new StartWalkBackRight(this.character))
    } else if (angle > range * 0.3) {
      // this.character.setState(new StartWalkLeft(this.character))
    } else if (angle < -range * 0.3) {
      // this.character.setState(new StartWalkRight(this.character))
    } else {
      // this.character.setState(new StartWalkForward(this.character))
    }
  }

  protected playAnimation(animationName: string, fadeIn: number): void {
    this.animationLength = this.character.setAnimation(animationName, fadeIn)
  }

}
