export abstract class SimulatorBase {
  public mass: any;
  public damping: any;
  public frameTime: number;
  public offset: number;

  public abstract cache: any[];

  constructor(fps: number, mass: number, damping: number) {
    this.mass = mass
    this.damping = damping
    this.frameTime = 1 / fps
    this.offset = 0
  }

  setFPS = (value: number) => {
    this.frameTime = 1 / value
  }

  lastFrame = () => {
    return this.cache[this.cache.length - 1]
  }

  generateFrames = (timeStep: number) => {
    let totalTimeStep = this.offset + timeStep
    let framesToGenerate = Math.floor(totalTimeStep / this.frameTime)
    this.offset = totalTimeStep % this.frameTime

    if (framesToGenerate > 0) {
      for (let i = 0; i < framesToGenerate; i++) {
        this.cache.push(this.getFrame(i + 1 === framesToGenerate))
      }

      this.cache = this.cache.slice(-2)
    }
  }

  public abstract getFrame(isLastFrame: boolean): any

  public abstract simulate(timeStep: number): void
}
