import { ICharacterState } from "../../interfaces/ICharacterState";
import { getSignedAngleBetweenVectors } from "../../utils/function-library";
import { Falling, Sprint, Walk, Landing, Idle } from ".";
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

  }

  public noDirection(): boolean {
		return !this.character.actions.up.isPressed && !this.character.actions.down.isPressed && !this.character.actions.left.isPressed && !this.character.actions.right.isPressed;

  }

  public anyDirection(): boolean {
		return this.character.actions.up.isPressed || this.character.actions.down.isPressed || this.character.actions.left.isPressed || this.character.actions.right.isPressed;
  }

  public fallInAir(): void {
    if (!this.character.rayWasHit) {
      this.character.setState(
        new Falling(this.character)
      )
    }
  }

  public animationHasEnded(timeStep: number): boolean {
    if (this.character.mixer === undefined) {
      return true
    }

    if (!this.animationLength) {
      return false
    }

    return this.timer > this.animationLength - timeStep
  }

  public setAppropriateDropState() {
    this.character.setState(new Idle(this.character))
  }

  public setAppropriateStartWalkState(): void {
    let range = Math.PI
    let angle = getSignedAngleBetweenVectors(this.character.orientation, this.character.getCameraRelativeMovementVector())

    this.character.setState(new Walk(this.character))

    // if (angle > range * 0.8) {
    //   this.character.setState(new StartWalk(this.character, StartWalkDirection.BackLeft))
    // } else if (angle < -range * 0.8) {
    //   this.character.setState(new StartWalk(this.character, StartWalkDirection.BackRight))
    // } else if (angle > range * 0.3) {
    //   this.character.setState(new StartWalk(this.character, StartWalkDirection.Left))
    // } else if (angle < -range * 0.3) {
    //   this.character.setState(new StartWalk(this.character, StartWalkDirection.Right))
    // } else {
    //   this.character.setState(new StartWalk(this.character, StartWalkDirection.Forward))
    // }
  }

  protected playAnimation(animationName: string, fadeIn: number): void {
    this.animationLength = this.character.setAnimation(animationName, fadeIn)
  }

}
