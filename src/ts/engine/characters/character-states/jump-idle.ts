import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { CharacterStateBase, Falling, } from ".";
import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";

export class JumpIdle extends CharacterStateBase implements ICharacterState {
  private alreadyJumped: boolean;

	constructor(character: Character)
	{
		super(character);

		this.character.velocitySimulator.mass = 50;

		this.character.setArcadeVelocityTarget(0);
		this.playAnimation(DefaultAnimations.JumpIdle, 0.1);
		this.alreadyJumped = false;
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);

		// Move in air
		if (this.alreadyJumped)
		{
			this.character.setCameraRelativeOrientationTarget();
			this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);
		}

		// Physically jump
		if (this.timer > 0.2 && !this.alreadyJumped)
		{
			this.character.jump();
			this.alreadyJumped = true;

			this.character.velocitySimulator.mass = 100;
			this.character.rotationSimulator.damping = 0.3;

			if (this.character.rayResult.body.velocity.length() > 0)
			{
				this.character.setArcadeVelocityInfluence(0, 0, 0);
			}
			else
			{
				this.character.setArcadeVelocityInfluence(0.3, 0, 0.3);
			}
			
		}
		else if (this.timer > 0.25 && this.character.rayWasHit)
		{
			this.setAppropriateDropState();
		}
		else if (this.animationHasEnded(timeStep))
		{
			this.character.setState(new Falling(this.character));
		}
	}
}