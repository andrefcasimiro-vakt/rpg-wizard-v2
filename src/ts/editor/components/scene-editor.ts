import { AmbientLight, AxesHelper, BackSide, BoxGeometry, GridHelper, ImageUtils, Intersection, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, PointLight, Ray, Raycaster, RepeatWrapping, Scene, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from "three";
import { IEditor } from "../interfaces/IEditor";
import { OrbitControls } from '../../../lib/orbitControls'
import { MapEditor } from "./map-editor";
import { IMapGround } from "../interfaces/IMap";
import _ = require("lodash");

// Cache
var skyboxGeometry = new BoxGeometry(1000, 1000, 1000)
var skyboxMaterial = new MeshBasicMaterial({ color: 0xffffee, side: BackSide })
var skybox = new Mesh(skyboxGeometry, skyboxMaterial)

var axis = new AxesHelper(33)
axis.position.y = 0.01

var light = new PointLight(0xffffff)
light.position.set(100, 250, 100)

export class SceneEditor implements IEditor {

  public scene: Scene

  public camera: PerspectiveCamera

  public renderer: WebGLRenderer

  private orbitControls: OrbitControls

  private raycaster: Raycaster = new Raycaster()
  private mouse: Vector2 = new Vector2()

  public onIntersection: (intersection: Intersection) => void;

  private mapEditor: MapEditor

  // Grid
  private squareT: Texture;
  private basePlane: Mesh;

  constructor(
    mapEditor: MapEditor
  ) {
    this.mapEditor = mapEditor

    this.scene = new Scene()

    // Camera
    var SCREEN_WIDTH = window.innerWidth
    var SCREEN_HEIGHT = window.innerHeight
    var VIEW_ANGLE = 45
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    var NEAR = 0.1
    var FAR = 2000

    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    this.camera.position.z = 5

    // Grid
    this.squareT = new TextureLoader().load('build/assets/square-thick.png')
    this.squareT.wrapS = this.squareT.wrapT = RepeatWrapping
    this.squareT.repeat.set(1, 1)

    var planeGeo = new BoxGeometry(1, 1, 1)
    var planeMat = new MeshBasicMaterial({ transparent: true, map: this.squareT, color: 0xbbbbbb, opacity: 0.9 })
    this.basePlane = new Mesh(planeGeo, planeMat)
    this.basePlane.rotation.x = -Math.PI / 2

    // Renderer
    this.renderer = new WebGLRenderer()
    document.body.appendChild(this.renderer.domElement)

    // Controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

    // Events
    window.addEventListener('mousemove', this.onMouseMove, false)

    this.animate()

    this.drawScene()
  }

  onMouseMove = (event: MouseEvent) => {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
  }

  resize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  animate = () => {
    requestAnimationFrame(this.animate)

    this.update()
  }

  update = () => {
    this.renderer.render(this.scene, this.camera)

    this.resize()
    this.handleRaycast()
  }

  handleRaycast = () => {
    if (!this.onIntersection) {
      return
    }

    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    const CURRENT_LAYER = 0

    const intersections = this.raycaster
      .intersectObjects(
        this.scene.children.filter(x => x.position.y === CURRENT_LAYER)
      )

    // Capture the first intersection only
    if (intersections?.length) {
      this.onIntersection(intersections[0])
    }
  }

  drawScene = (options?: { queuedGround?: IMapGround, fillColor?: string }) => {
    this.clearScene()
    
    let width = 50
    let depth = 50

    const currentMapGrounds = this.mapEditor.getCurrentMap()?.layers?.[0]?.grounds || []
    const groundMesh = new Mesh(new BoxGeometry(1, 1, 1))

    const sceneChildren: Mesh[] = []
    const mapGrounds: IMapGround[] = []

    for (let i = -width / 2; i < width / 2; i++) {
      for (let j = -depth / 2; j < depth / 2; j++) {
        var entry: Mesh;

        // Is filling entire grid?
        const fillingColor = options?.fillColor
        if (fillingColor) {
          entry = this.basePlane.clone()
          entry.material = new MeshBasicMaterial({ color: fillingColor })
          entry.position.set(i, 0, j)

          mapGrounds.push({ position: entry.position, color: fillingColor })
          sceneChildren.push(entry)
          continue
        }

        // Has a ground waiting to be painted at this position?
        const queuedPosition = options?.queuedGround.position
        if (queuedPosition?.x === i && queuedPosition?.z === j) {
          entry = this.basePlane.clone()
          entry.material = new MeshBasicMaterial({ color: options?.queuedGround.color })
          entry.position.set(i, 0, j)

          mapGrounds.push({ position: entry.position, color: options?.queuedGround.color })
          sceneChildren.push(entry)
          continue
        }

        // Has found an already painted ground
        const paintedGround = currentMapGrounds.find((ground) => ground.position.x === i && ground.position.z === j)
        if (paintedGround) {
          entry = groundMesh.clone()
          entry.material = new MeshBasicMaterial({ color: paintedGround.color})
          entry.position.set(i, 0, j)

          mapGrounds.push({ position: entry.position, color: paintedGround.color })
          sceneChildren.push(entry)
          continue
        }

        // Nothing, draw the placeholder grid
        entry = this.basePlane.clone()
        entry.position.set(i, 0, j)
        sceneChildren.push(entry)
      }
    }

    this.scene.add(...sceneChildren)

    this.mapEditor.updateMap(this.mapEditor.getCurrentMapUuid(), {
      layers: [{ grounds: mapGrounds }]
    })
  }

  clearScene = () => {
    this.scene = new Scene()

    this.scene.add(skybox)

    this.scene.add(axis)

    // Ambient light
    this.scene.add(light)
  }

  save = () => {

  }

  load = () => {

  }

}
