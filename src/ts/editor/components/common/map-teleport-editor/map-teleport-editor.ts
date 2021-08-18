import { MapVisualizer } from "src/ts/editor/components/common/map-visualizer/map-visualizer";
import { MapStorage } from "src/ts/storage";
import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, Vector3 } from "three";

export class MapTeleportEditor extends MapVisualizer {

  mapUuidToTeleport: string

  positionToTeleport: Vector3

  brush: Mesh

  teleportMarker: Mesh

  onIntersectionCompleted: (mapUuidToTeleport: string, spawnPosition: Vector3) => void;

  isPainting: boolean = false

  constructor(container: HTMLElement, clientWidth: number, clientHeight: number) {
    super(container, clientWidth, clientHeight)

    this.onIntersect = this.handleIntersection

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  initBrushes() {
    this.brush = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'red' }))
    this.brush.visible = true
    this.scene.add(this.brush)

    this.teleportMarker = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'purple' }))
    this.teleportMarker.visible = false

    if (this.positionToTeleport) {
      if (this.currentMap?.uuid === this.mapUuidToTeleport) {
        this.teleportMarker.scale.setScalar(0.9)
        this.teleportMarker.position.set(this.positionToTeleport.x, this.positionToTeleport.y + .05, this.positionToTeleport.z)
        this.teleportMarker.visible = true
      }
    } 
    this.scene.add(this.teleportMarker)
  }

  renderScene() {
    super.renderScene()

    this.initBrushes()
  }

  handleIntersection = (intersectionPoint: Vector3) => {
    var intersectionPosition = intersectionPoint.round()

    var nextPosition = intersectionPosition.clone()
    nextPosition.y = this.currentLayer
    this.brush.position.set(nextPosition.x, this.currentLayer + 0.01, nextPosition.z)

    if (!this.isPainting) return;

    this.mapUuidToTeleport = this.currentMap.uuid
    this.positionToTeleport = nextPosition

    if (this.onIntersectionCompleted) {
      this.onIntersectionCompleted(this.mapUuidToTeleport, this.positionToTeleport)
    }
  }

  handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.code === 'ShiftLeft') {
      this.isPainting = true
    }
  }

  handleKeyUp = (evt: KeyboardEvent) => {
    if (evt.code === 'ShiftLeft') {
      this.isPainting = false
    }
  }
}
