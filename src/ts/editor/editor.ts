import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { EntityEditor } from "./components/entity-editor";
import { MapEditor } from "./components/map-editor";
import { SceneEditor } from "./components/scene-editor";
import { IGround } from "./interfaces/IEntity";

export class Editor {
  private entityEditor: EntityEditor;
  private mapEditor: MapEditor;
  private sceneEditor: SceneEditor;

  private sidebarUi: HTMLElement

  private brush: Mesh
  
  constructor() {
    this.sidebarUi = document.createElement('div')
    this.sidebarUi.style.position = 'absolute'
    this.sidebarUi.style.display = 'flex'
    this.sidebarUi.style.flexDirection = 'column'
    this.sidebarUi.style.width = '300px'
    this.sidebarUi.style.height = '100%'
    this.sidebarUi.style.background = 'rgba(255, 255, 255, 0.2)'
    this.sidebarUi.style.overflow = 'scroll'
    document.body.appendChild(this.sidebarUi)

    this.entityEditor = new EntityEditor(this.sidebarUi)
    this.mapEditor = new MapEditor(this.sidebarUi)   
    this.sceneEditor = new SceneEditor()

    // Add brush to scene
    this.brush = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'red' }))
    this.brush.visible = true
    this.sceneEditor.scene.add(this.brush)

    this.onEntityChange = this.onEntityChange.bind(this)
    this.onIntersection = this.onIntersection.bind(this)

    this.entityEditor.onEntityChange = this.onEntityChange
    this.sceneEditor.onIntersection = this.onIntersection
  }

  onEntityChange() {
    const ground = this.entityEditor.selectedEntity as IGround

    // @ts-ignore
    this.placeholderEntityMesh.material.color.set(ground.color || 'yellow')
  }

  onIntersection(intersection: Intersection) {
    var intersectionPosition = intersection.point.round()
    console.log('intersection: ', intersection)
    // @ts-ignore
    this.brush.material.color.set(this.entityEditor.selectedEntity?.color || 'yellow')
    var nextPosition = intersectionPosition.clone()
    this.brush.position.set(nextPosition.x, nextPosition.y, nextPosition.z)
  }
}
