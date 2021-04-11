import { World } from "../entities/world"
import { LoadingTracker } from "./loading-tracker"
import { UIManager } from "./ui-manager";

export class LoadingManager {
  public firstLoad: boolean = true
  public onFinishedCallback: () => void;

  private world: World
  private loadingTracker: LoadingTracker[] = []
  
  constructor(world: World) {
    this.world = world

    this.world.setTimeScale(0)
    UIManager.setLoadingScreenVisible(true)
  }

  addLoadingEntry = (path: string): LoadingTracker => {
    const entry = new LoadingTracker(path)
    this.loadingTracker.push(entry)
    return entry
  }

  doneLoading = (trackerEntry: LoadingTracker) => {
    trackerEntry.finished = true
    trackerEntry.progress = 1

    if (this.isLoadingDone()) {
      if (this.onFinishedCallback) this.onFinishedCallback()

      UIManager.setLoadingScreenVisible(false)
    }
  }

  isLoadingDone = (): boolean => {
    for (const entry of this.loadingTracker) {
      if (entry.finished === false) return false
    }

    return true
  }
}
