import { Vector3 } from "three";

export class SimulationFrame {
  public position: number
  public velocity: number

  constructor(position: number, velocity: number) {
    this.position = position
    this.velocity = velocity
  }
}
