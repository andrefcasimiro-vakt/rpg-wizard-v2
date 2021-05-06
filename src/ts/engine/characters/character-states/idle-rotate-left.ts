import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";
import { CharacterStateBase, Idle, Walk } from ".";
import { JumpIdle } from "./jump-idle";

export class IdleRotateLeft extends CharacterStateBase implements ICharacterState {
  constructor(character: Character)
	{
		super(character);

		this.character.rotationSimulator.mass = 30;
		this.character.rotationSimulator.damping = 0.6;

		this.character.velocitySimulator.damping = 0.6;
		this.character.velocitySimulator.mass = 10;

		this.character.setArcadeVelocityTarget(0);
		this.playAnimation('rotate_left', 0.1);
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);

		if (this.animationHasEnded(timeStep))
		{
			this.character.setState(new Idle(this.character));
		}

		this.fallInAir();
	}

	public onInputChange(): void
	{
		super.onInputChange();
		
		if (this.character.actions.jump.justPressed)
		{
			this.character.setState(new JumpIdle(this.character));
		}

		if (this.anyDirection())
		{
			if (this.character.velocity.length() > 0.5)
			{
				this.character.setState(new Walk(this.character));
			}
			else
			{
				this.setAppropriateStartWalkState();
			}
		}
	}
}
