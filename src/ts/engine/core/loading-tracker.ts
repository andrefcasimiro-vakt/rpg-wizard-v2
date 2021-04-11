export class LoadingTracker {
  public path: string
  public progress: number = 0
  public finished: boolean

  constructor(path: string) {
    this.path = path
  }
}
