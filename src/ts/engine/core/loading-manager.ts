import { World } from "../entities/world"
import { LoadingTracker } from "./loading-tracker"
import { UIManager } from "./ui-manager";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class LoadingManager {
  public firstLoad: boolean = true
  public onFinishedCallback: () => void;

  private world: World
  private loadingTracker: LoadingTracker[] = []
  
  fbxLoader: FBXLoader

  private gltfLoader: GLTFLoader;

  constructor(world: World) {
    this.world = world
    this.gltfLoader = new GLTFLoader();
    this.fbxLoader = new FBXLoader();

    this.world.setTimeScale(0)
    UIManager.setLoadingScreenVisible(true)
  }

  addLoadingEntry = (path: string): LoadingTracker => {
    const entry = new LoadingTracker(path)
    this.loadingTracker.push(entry)
    return entry
  }

  loadFbx = (path: string, onLoadingFinished: (result: Group) => void) => {
    let trackerEntry = this.addLoadingEntry(path)

    this.fbxLoader.load(path,
      (result) => {
        onLoadingFinished(result)

        this.doneLoading(trackerEntry)
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          trackerEntry.progress = xhr.loaded / xhr.total
        }
      },
      (error) => {
        console.error('Error loading GLTF: ', error)
      }
    )
  }
  
  loadGLTF(path: string, onLoadingFinished: (gltfResult: any) => void): void {
    let trackerEntry = this.addLoadingEntry(path)

    this.gltfLoader.load(
      path,
      (gltfResult) => {
        onLoadingFinished(gltfResult)
        this.doneLoading(trackerEntry)
      }),
      (xhr) => {
        if (xhr.lengthComputable) {
          trackerEntry.progress = xhr.loaded / xhr.total
        }
      },
      (error) => {
        console.error('Error loading GLTF: ', error)
      }
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
