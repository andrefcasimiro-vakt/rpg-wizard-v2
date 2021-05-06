import { CharacterStateBase, EndWalk, Idle, StartWalk, StartWalkDirection, Walk } from ".";
import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";

export class DropRolling extends CharacterStateBase implements ICharacterState {
	constructor(character: Character)
	{
		super(character);

		this.character.velocitySimulator.mass = 1;
		this.character.velocitySimulator.damping = 0.6;

		this.character.setArcadeVelocityTarget(0.8);
		this.playAnimation('drop_running_roll', 0.03);
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);

		this.character.setCameraRelativeOrientationTarget();

		if (this.animationHasEnded(timeStep))
		{
			if (this.anyDirection())
			{
				this.character.setState(new Walk(this.character));
			}
			else
			{
				this.character.setState(new EndWalk(this.character));
			}
		}
	}
}
