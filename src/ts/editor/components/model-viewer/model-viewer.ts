import THREE = require("three");
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from '../../../../lib/orbitControls'
import { Object3D} from "three";
import { setupMeshProperties } from "src/ts/engine/utils/function-library";

export class ModelViewer {
  scene: THREE.Scene
  model: THREE.Scene | THREE.Object3D
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: OrbitControls

  fbxLoader: FBXLoader

  container: HTMLElement
  loadingSpinner: HTMLElement

  width: number
  height: number
  modelScale: number

  constructor(container, width, height, modelScale) {
    this.container = container

    this.width = width
    this.height = height

    this.modelScale = modelScale
    this.fbxLoader = new FBXLoader()
  }

  setupScene = () => {
    this.scene = null

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xa0a0a0 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    this.scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    this.scene.add( dirLight );

    // Ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );

    this.renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    this.renderer.setPixelRatio(this.width / this.height);
    this.renderer.setSize(this.width, this.height)
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;

    // camera
    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 5000 );
    this.camera.position.set( - 1, 2, 3 );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement );
    this.controls.update();
    
    window.addEventListener( 'resize', this.onWindowResize );
  }

  load = async (assetPath: string, onModelLoadFinish?: (loadedModel) => void) => {
    this.loadingSpinner = document.createElement('div')
    this.loadingSpinner.className = "loader"
    this.container.appendChild(this.loadingSpinner)

    this.setupScene()

    if (!assetPath) {
      this.container.removeChild(this.loadingSpinner)
      return
    }

    this.fbxLoader.load(assetPath, (fbx: Object3D) => {

      this.container.removeChild(this.loadingSpinner)
      this.container.appendChild(this.renderer.domElement);

      fbx.scale.setScalar(this.modelScale)

      this.model = fbx

      fbx?.children?.forEach(setupMeshProperties)

      this.scene.add(fbx);

      fbx.traverse((object: any) => {
        if (object.isMesh) object.castShadow = true;
      })

      if (onModelLoadFinish) {
        onModelLoadFinish(fbx)
      }

      this.animate()
    })
  }

  onWindowResize = () => {
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  takeScreenshot = () => {
    return this.renderer.domElement.toDataURL("image/png");
  }
  
  animate = () => {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

}
