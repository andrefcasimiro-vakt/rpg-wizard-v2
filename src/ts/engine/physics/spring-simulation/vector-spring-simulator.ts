import { Vector3 } from "three";
import { springV } from "../../utils/function-library";
import { SimulationFrameVector } from "./simulation-frame-vector";
import { SimulatorBase } from "./simulator-base";

export class VectorSpringSimulator extends SimulatorBase {
  public position: Vector3
  public velocity: Vector3
  public target: Vector3
  public cache: SimulationFrameVector[]

  constructor(fps: number, mass: number, damping: number) {
    super(fps, mass, damping)

    this.init()
  }

  init = () => {
    this.position = new Vector3()
    this.velocity = new Vector3()
    this.target = new Vector3()

    // Initialize cache by pushing two frames
    this.cache = []
    for (let i = 0; i < 2; i++) {
      this.cache.push(
        new SimulationFrameVector(new Vector3(), new Vector3())
      )
    }
  }

  simulate = (timeStep: number) => {
    this.generateFrames(timeStep)

    this.position.lerpVectors(this.cache[0].position, this.cache[1].position, this.offset / this.frameTime)
    this.velocity.lerpVectors(this.cache[0].velocity, this.cache[1].velocity, this.offset / this.frameTime)
  }

  getFrame = () => {
    // Deep clone data from previous frame
    let newSpring = new SimulationFrameVector(
      this.lastFrame().position.clone(),
      this.lastFrame().velocity.clone()
    )

    // Calculate new spring
    springV(newSpring.position, this.target, newSpring.velocity, this.mass, this.damping)

    return newSpring
  }
}