import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { CharacterStateBase, Idle, StartWalk, StartWalkDirection, Falling } from ".";
import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";

export class JumpRunning extends CharacterStateBase implements ICharacterState {
	private alreadyJumped: boolean;

	constructor(character: Character)
	{
		super(character);

		this.character.velocitySimulator.mass = 100;
		this.playAnimation(DefaultAnimations.JumpRunning, 0.03);
		this.alreadyJumped = false;
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);

		this.character.setCameraRelativeOrientationTarget();

		// Move in air
		if (this.alreadyJumped)
		{
			this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);
		}
		// Physically jump
		if (this.timer > 0.13 && !this.alreadyJumped)
		{
			this.character.jump(4);
			this.alreadyJumped = true;

			this.character.rotationSimulator.damping = 0.3;
			this.character.arcadeVelocityIsAdditive = true;
			this.character.setArcadeVelocityInfluence(0.05, 0, 0.05);
		}
		else if (this.timer > 0.24 && this.character.rayWasHit)
		{
			this.setAppropriateDropState();
		}
		else if (this.animationHasEnded(timeStep))
		{
			this.character.setState(new Falling(this.character));
		}
	}
}
