import { AmbientLight, AxesHelper, BackSide, BoxGeometry, GridHelper, ImageUtils, Intersection, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, PointLight, Ray, Raycaster, RepeatWrapping, Scene, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from "three";
import { IEditor } from "../interfaces/IEditor";
import { OrbitControls } from '../../../lib/orbitControls'
import { MapEditor } from "./map-editor";
import { IGround } from "../interfaces/IMap";
import _ = require("lodash");

export class SceneEditor implements IEditor {

  public scene: Scene

  public camera: PerspectiveCamera

  public renderer: WebGLRenderer

  private orbitControls: OrbitControls

  private raycaster: Raycaster = new Raycaster()
  private mouse: Vector2 = new Vector2()

  public onIntersection: (intersection: Intersection) => void;

  public grid: Mesh[] = []

  public layer1Grounds: Mesh[] = []

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

    // Scene
    this.recreateScene()

    // Grid
    this.squareT = new TextureLoader().load('build/assets/square-thick.png')
    this.squareT.wrapS = this.squareT.wrapT = RepeatWrapping
    this.squareT.repeat.set(1, 1)

    var planeGeo = new PlaneGeometry(1, 1)
    var planeMat = new MeshBasicMaterial({ map: this.squareT, color: 0xbbbbbb})
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

    this.redrawScene()
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

    this.raycaster
      .intersectObjects([...this.grid, ...this.layer1Grounds])
      .forEach(this.onIntersection)
  }

  drawGrid = () => {    
    let width = 50
    let depth = 50

    for (let i = -width / 2; i < width / 2; i++) {
      for (let j = -depth / 2; j < depth / 2; j++) {

        const ground = this.layer1Grounds.find((ground) => ground.position.x === i && ground.position.z === j)
        if (ground) {
          const entry = ground.clone()
          entry.position.set(i, -0.5, j)
          this.scene.add(entry)
          continue
        }
        
        var entry = this.basePlane.clone()
        entry.position.set(i, 0, j)

        this.grid.push(entry)
        this.scene.add(entry)
      }
    }
  }

  recreateScene = () => {
    this.scene = new Scene()

    var skyboxGeometry = new BoxGeometry(1000, 1000, 1000)
    var skyboxMaterial = new MeshBasicMaterial({ color: 0xffffee, side: BackSide })
    var skybox = new Mesh(skyboxGeometry, skyboxMaterial)
    this.scene.add(skybox)

    var axis = new AxesHelper(33)
    axis.position.y = 0.01
    this.scene.add(axis)

    // Ambient light
    var light = new PointLight(0xffffff)
    light.position.set(100, 250, 100)
    this.scene.add(light)
  }

  clearScene = () => {
    this.recreateScene()
    
    this.layer1Grounds = []
    this.grid = []
  }

  redrawScene = () => {   
    this.clearScene()

    const grounds = this.mapEditor.currentMap?.layers?.[0]?.grounds || []
    const mesh = new Mesh(new BoxGeometry(.8, 1, .8))

    for (const ground of grounds) {
      const tmp = mesh.clone()
      const y =  -0.5 // -0.5 // Layer 1
      tmp.position.set(ground.position.x, y, ground.position.z)
      tmp.material = new MeshBasicMaterial({ color: ground.color})

      this.layer1Grounds.push(tmp)
    }

    this.drawGrid()
  }

  save = () => {

  }

  load = () => {

  }

}
