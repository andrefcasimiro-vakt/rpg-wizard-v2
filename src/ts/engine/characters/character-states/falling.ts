import { DefaultAnimations } from "src/ts/editor/enums/DefaultAnimations";
import { CharacterStateBase, Idle, StartWalk, StartWalkDirection } from ".";
import { ICharacterState } from "../../interfaces/ICharacterState";
import { Character } from "../character";

export class Falling extends CharacterStateBase implements ICharacterState {
  constructor(character: Character)
	{
		super(character);

		this.character.velocitySimulator.mass = 100;
		this.character.rotationSimulator.damping = 0.3;

		this.character.arcadeVelocityIsAdditive = true;
		this.character.setArcadeVelocityInfluence(0.05, 0, 0.05);

		this.playAnimation(DefaultAnimations.Falling, 0.3);
	}

	public update(timeStep: number): void
	{
		super.update(timeStep);

		this.character.setCameraRelativeOrientationTarget();
		this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);

		if (this.character.rayWasHit)
		{
			this.setAppropriateDropState();
		}
	}
}