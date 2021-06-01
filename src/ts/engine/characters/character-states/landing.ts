import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { CharacterStateBase, Idle, JumpIdle } from ".";
import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";
import { Walk } from "./walk";

export class Landing extends CharacterStateBase implements ICharacterState {
  constructor(character: Character)
	{
		super(character);

		this.character.velocitySimulator.damping = 0.5;
		this.character.velocitySimulator.mass = 7;

		this.character.setArcadeVelocityTarget(0);
		this.playAnimation(DefaultAnimations.Landing, 2.1);

		if (this.anyDirection())
		{
			this.character.setState(new Walk(character));
		}
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);
		this.character.setCameraRelativeOrientationTarget();
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
			this.character.setState(new Walk(this.character));
		}
	}
}