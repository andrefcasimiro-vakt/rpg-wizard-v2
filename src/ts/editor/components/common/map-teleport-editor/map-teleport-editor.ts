import { MapVisualizer } from "src/ts/editor/components/common/map-visualizer/map-visualizer";
import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, Vector3 } from "three";

export class MapTeleportEditor extends MapVisualizer {

  mapUuidToTeleport: string

  positionToTeleport: Vector3

  brush: Mesh

  onSelectedPosition: (selectedPosition: Vector3) => void

  constructor(container: HTMLElement, clientWidth: number, clientHeight: number) {
    super(container, clientWidth, clientHeight)

    this.initBrush()

    this.onIntersect = this.handleIntersection
  }

  initBrush = () => {
    this.brush = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'red' }))
    this.brush.visible = true

  }

  renderScene() {
    super.renderScene()

    this.scene.add(this.brush)
  }

  handleIntersection = (intersectionPoint: Vector3) => {
    var intersectionPosition = intersectionPoint.round()

    var nextPosition = intersectionPosition.clone()
    nextPosition.y = this.currentLayer
    this.brush.position.set(nextPosition.x, this.currentLayer + 0.01, nextPosition.z)
  }
  
  
}
