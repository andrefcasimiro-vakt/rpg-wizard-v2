import THREE = require("three");
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from '../../../../lib/orbitControls'
import { Object3D } from "three";

export class ModelViewer {
  scene: THREE.Scene
  model: THREE.Scene | THREE.Object3D
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera

  container: HTMLElement

  width: number
  height: number

  loadingSpinner: HTMLElement

  controls: any

  constructor(container, width, height) {
    this.container = container

    this.width = width
    this.height = height
  }

  load = (assetPath: string, onModelLoadFinish?: () => void) => {
    this.loadingSpinner = document.createElement('div')
    this.loadingSpinner.className = "loader"
    this.container.appendChild(this.loadingSpinner)

    this.scene = null

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xa0a0a0 );
    // this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

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

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio(this.width / this.height);
    this.renderer.setSize(this.width, this.height)
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;

    var loader
    // if (assetPath.includes('.fbx')) {
      loader = new FBXLoader()
      loader.load(assetPath, (fbx: Object3D) => {
        this.model = fbx
        this.scene.add(fbx);
  
        fbx.traverse((object: any) => {
          if (object.isMesh) object.castShadow = true;
        })

        if (onModelLoadFinish) {
          onModelLoadFinish()
        }

        this.container.removeChild(this.loadingSpinner)
        this.container.appendChild(this.renderer.domElement);
        this.animate()
      })
    // }
    // else {
    //   loader = new GLTFLoader()
    //   loader.load(assetPath, (gltf) => {
    //     this.model = gltf.scene;
    //     this.scene.add(this.model);
  
    //     this.model.traverse((object: any) => {
    //       if (object.isMesh) object.castShadow = true;
    //     })

    //     if (onModelLoadFinish) {
    //       onModelLoadFinish()
    //     }

    //     this.container.innerHTML = ''
    //     this.container.appendChild(this.renderer.domElement);
    //     this.animate()
    //   })
    // }

    // camera
    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 5000 );
    this.camera.position.set( - 1, 2, 3 );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement );
    this.controls.update();
    
    window.addEventListener( 'resize', this.onWindowResize );
  }

  onWindowResize = () => {

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);

  }
  
  animate = () => {
    requestAnimationFrame(this.animate)

    this.renderer.render(this.scene, this.camera)
  }

}