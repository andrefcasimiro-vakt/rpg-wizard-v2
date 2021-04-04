import { AmbientLight, AxesHelper, BackSide, BoxGeometry, GridHelper, ImageUtils, Intersection, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Ray, Raycaster, RepeatWrapping, Scene, TextureLoader, Vector2, Vector3, WebGLRenderer } from "three";
import { IEditor } from "../interfaces/IEditor";
import { OrbitControls } from '../../../lib/orbitControls'

export class SceneEditor implements IEditor {

  public scene: Scene

  public camera: PerspectiveCamera

  public renderer: WebGLRenderer

  private ambientLight: AmbientLight

  private orbitControls: OrbitControls

  private gridHelper: GridHelper

  private raycaster: Raycaster = new Raycaster()
  private mouse: Vector2 = new Vector2()

  private previousPoint: Vector3

  public onIntersection: (intersection: Intersection) => void;

  public groundGrid: Mesh[] = []

  constructor() {
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

    // Skybox
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

    // Grid
    var squareT = new TextureLoader().load('build/assets/square-thick.png')
    squareT.wrapS = squareT.wrapT = RepeatWrapping
    squareT.repeat.set(1, 1)

    var planeGeo = new PlaneGeometry(1, 1)
    var planeMat = new MeshBasicMaterial({ map: squareT, color: 0xbbbbbb})
    var basePlane = new Mesh(planeGeo, planeMat)
    basePlane.rotation.x = -Math.PI / 2

    let width = 50
    let depth = 50

    for (let i = -width / 2; i < width / 2; i++) {
      for (let j = -depth / 2; j < depth / 2; j++) {
        var entry = basePlane.clone()
        entry.position.set(i, 0, j)
        this.groundGrid.push(entry)
        this.scene.add(entry)
      }
    }


    // const geometry =  new BoxGeometry(1, 1, 1);
    // const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new Mesh( geometry, material );
    // this.scene.add( cube );

    // // Camera
    // this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // this.camera.position.z = 5

    // Renderer
    this.renderer = new WebGLRenderer()
    document.body.appendChild(this.renderer.domElement)

    // // Ambient Light
    // this.ambientLight = new AmbientLight(0x404040)
    // this.scene.add(this.ambientLight)

    // Controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

    // // Grid Helper
    // this.gridHelper = new GridHelper(10, 10)
    // this.gridHelper.position.set(.5, .5, .5)
    // this.gridHelper.scale.setScalar(1)
    // this.scene.add(this.gridHelper)

    this.onMouseMove = this.onMouseMove.bind(this)
    this.animate = this.animate.bind(this)
    this.render = this.render.bind(this)
    this.handleRaycast = this.handleRaycast.bind(this)

    // Events
    window.addEventListener('mousemove', this.onMouseMove, false)



    this.animate()
  }


  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  // update() {
  //   const animate = () => {
  //     requestAnimationFrame(animate);

  //     this.orbitControls.update()

  //     this.handleRaycast()

  //     this.renderer.render(this.scene, this.camera);
  //   }

  //   animate()
  // }

  //   handleRaycast() {
  //   // Raycaster
  //   this.raycaster.setFromCamera(this.mouse, this.camera)
  //   const intersects = this.raycaster.intersectObjects([this.gridHelper])
  //   if (!intersects?.length) {
  //     return;
  //   }

  //   const point = intersects[0]?.point.round()

  //   if (point.isVector3 && this.previousPoint && point.equals(this.previousPoint)) {
  //     return;
  //   }

  //   console.log(intersects)

  //   this.previousPoint = point

  //   console.log(point)

  //   if (this.onIntersection) {
  //     this.onIntersection(point, this.previousPoint)
  //   }

  // }

  animate() {
    requestAnimationFrame(this.animate)

    this.render()
    this.update()

  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  update() {
    this.resize()
    this.handleRaycast()
    // var delta = this.clock.getDelta()
  }

  handleRaycast() {
    if (!this.onIntersection) {
      return
    }

    this.raycaster.setFromCamera(this.mouse, this.camera)

    this.raycaster
      .intersectObjects(this.groundGrid)
      .forEach(this.onIntersection)
  }

  onSave() {

  }

  onLoad() {

  }

}
