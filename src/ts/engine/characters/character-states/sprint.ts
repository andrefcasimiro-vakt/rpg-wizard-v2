import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { CharacterStateBase, Idle, StartWalk, StartWalkDirection, JumpRunning, Walk, EndWalk } from ".";
import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";

export class Sprint extends CharacterStateBase implements ICharacterState {
	constructor(character: Character)
	{
		super(character);

		this.character.velocitySimulator.mass = 10;
		this.character.rotationSimulator.damping = 0.8;
		this.character.rotationSimulator.mass = 50;

		this.character.setArcadeVelocityTarget(1.4);
		this.playAnimation(DefaultAnimations.Sprint, 0.1);
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);
		this.character.setCameraRelativeOrientationTarget();
		this.fallInAir();
	}

	public onInputChange(): void
	{
		super.onInputChange();

		if (!this.character.actions.run.isPressed)
		{
			this.character.setState(new Walk(this.character));
		}

		if (this.character.actions.jump.justPressed)
		{
			this.character.setState(new JumpRunning(this.character));
		}

		if (this.noDirection())
		{
			this.character.setState(new Idle(this.character));
		}
	}
}
