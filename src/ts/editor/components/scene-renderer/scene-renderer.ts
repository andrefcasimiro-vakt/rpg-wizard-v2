import { AmbientLight, BackSide, BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { OrbitControls } from 'src/lib/orbitControls'

interface SceneOptions {
  ambientLightColor: string

  skyboxColor: string
}

export class SceneRenderer {

  options: SceneOptions

  scene: Scene
  renderer: WebGLRenderer
  skybox: Mesh
  ambientLight: AmbientLight
  camera: PerspectiveCamera
  orbitControls: OrbitControls
  raycaster: Raycaster
  mouse: Vector2

  container: HTMLElement
  canvasWidth: number
  canvasHeight: number

  constructor(container: HTMLElement, canvasWidth, canvasHeight, options: SceneOptions) {
    this.container = container
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.update = this.update.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)

    this.options = options

    this.scene = new Scene()

    this.initSkybox()
    this.initAmbientLight()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initRaycaster()
    this.initMouse()

    this.animate()
  }

  initSkybox = () => {
    const skyboxGeometry = new BoxGeometry(1000, 1000, 1000)
    const skyboxMaterial = new MeshBasicMaterial({ color: this.options.skyboxColor, side: BackSide })
    this.skybox = new Mesh(skyboxGeometry, skyboxMaterial)
    this.skybox.castShadow = true
  }

  initAmbientLight = () => {
    this.ambientLight = new AmbientLight(this.options.ambientLightColor, 1)
  }

  initCamera = () => {
    var SCREEN_WIDTH = this.canvasWidth
    var SCREEN_HEIGHT = this.canvasHeight
    var VIEW_ANGLE = 45
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    var NEAR = 0.1
    var FAR = 2000
    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    this.camera.position.z = 10
    this.camera.position.y = 5
  }

  initRenderer = () => {
    this.renderer = new WebGLRenderer()
    this.container.appendChild(this.renderer.domElement)
  }

  initControls = () => {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  initRaycaster = () => {
    this.raycaster = new Raycaster()
  }

  initMouse = () => {
    this.mouse = new Vector2()

    window.addEventListener('mousemove', this.onMouseMove, false)
    window.addEventListener('dblclick', this.onDoubleClick, false)
  }

  animate = () => {
    requestAnimationFrame(this.animate)

    this.update()
  }

  public update() {
    this.renderer.render(this.scene, this.camera)

    this.resize()
  }

  resize = () => {
    this.renderer.setSize(this.canvasWidth, this.canvasHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera.aspect = this.canvasWidth / this.canvasHeight
    this.camera.updateProjectionMatrix()
  }

  public onDoubleClick(event: MouseEvent) {
    const eventClientX = Math.abs(this.renderer.domElement.offsetLeft - event.clientX)
    const eventClientY = Math.abs(this.renderer.domElement.offsetTop - event.clientY)
    this.mouse.x = (eventClientX / this.canvasWidth) * 2 - 1;
    this.mouse.y = -(eventClientY / this.canvasHeight) * 2 + 1;
  }

  onMouseMove = (event: MouseEvent) => {
    const eventClientX = Math.abs(this.renderer.domElement.offsetLeft - event.clientX)
    const eventClientY = Math.abs(this.renderer.domElement.offsetTop - event.clientY)

    this.mouse.x = (eventClientX / this.canvasWidth) * 2 - 1;
    this.mouse.y = -(eventClientY / this.canvasHeight) * 2 + 1;
  }
}
