import { Vector3 } from "three";

export class SimulationFrameVector {
  public position: Vector3
  public velocity: Vector3

  constructor(position: Vector3, velocity: Vector3) {
    this.position = position
    this.velocity = velocity
  }
}
