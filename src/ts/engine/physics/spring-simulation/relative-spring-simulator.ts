import { MathUtils } from "three";
import { spring, springV } from "../../utils/function-library";
import { SimulationFrame } from "./simulation-frame";
import { SimulatorBase } from "./simulator-base";

export class RelativeSpringSimulator extends SimulatorBase {

  public position: number;
  public velocity: number;
  public target: number;
  public lastLerp: number;
  public cache: SimulationFrame[]

  constructor(fps: number, mass: number, damping: number, startPositon = 0, startVelocity = 0) {
    super(fps, mass, damping)

    this.position = startPositon
    this.velocity = startVelocity

    this.target = 0
    this.lastLerp = 0

    this.cache = []
    for (let i = 0; i < 2; i++) {
      this.cache.push({ position: startPositon, velocity: startVelocity })
    }
  }

  simulate = (timeStep: number): void => {
    this.generateFrames(timeStep)

    let lerp = MathUtils.lerp(0, this.cache[1].position, this.offset / this.frameTime)
    this.position = (lerp - this.lastLerp)
    this.lastLerp = lerp

    this.velocity = MathUtils.lerp(this.cache[0].velocity, this.cache[1].velocity, this.offset / this.frameTime)  
  }

  getFrame = (isLastFrame: boolean): SimulationFrame => {
    let newFrame = Object.assign({}, this.lastFrame())

    if (isLastFrame) {
      // Reset position
      newFrame.position = 0

      // Transition to next frame
      this.lastLerp = this.lastLerp - this.lastFrame().position
    }

    return spring(newFrame.position, this.target, newFrame.velocity, this.mass, this.damping)
  }
}