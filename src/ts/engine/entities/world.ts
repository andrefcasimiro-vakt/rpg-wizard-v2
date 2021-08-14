import { Clock, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as CANNON from 'cannon'
import { IUpdatable } from "../interfaces/IUpdatable";
import { IWorldEntity } from "../interfaces/IWorldEntity";
import _ = require("lodash");
import { InputManager } from "../core/input-manager";
import { CameraOperator } from "../core/camera-operator";
import { Character } from "../characters/character";
import { Scenario } from "./scenario";
import { CannonDebugRenderer } from '../../../lib/cannon/CannonDebugRenderer'
import { GameState } from "./game-state";
import { LoadingManager } from "../core/loading-manager";
import { MapStorage } from "src/ts/storage";
import THREE = require("three");

const MOUSE_SENSITIVITY = 0.3

export class World {
  public loadingManager: LoadingManager

  public renderer: WebGLRenderer
  public camera: PerspectiveCamera
  public graphicsWorld: Scene
  public physicsWorld: CANNON.World
  public parallelPairs = []
  public physicsFrameRate: number
  public physicsFrameTime: number
  public physicsMaxPrediction: number
  public clock: Clock
  public renderDelta: number 
  public logicDelta: number
  public requestDelta: number
  public sinceLastFrame: number
  public justRendered: boolean
  public params: any
  public inputManager: InputManager
  public cameraOperator: CameraOperator
  public timeScaleTarget = 1
  public updatables: IUpdatable[] = []

  public gameState: GameState = new GameState()

  public scenario: Scenario = null

  public characters: Character[] = []
  
  private lastScenarioID: string

  private cannonDebugRenderer: CannonDebugRenderer

  private debugPhysics: boolean = false

  constructor(sceneUuid?: string) {
    this.loadingManager = new LoadingManager(this)

    // Renderer
    this.renderer = new WebGLRenderer({ antialias: false })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    
    document.body.appendChild(this.renderer.domElement)
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap

    window.addEventListener('resize', this.onWindowResize, false)
  
    // Scene
    this.graphicsWorld = new Scene()
    this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100000)
    this.camera.position.set(0, 2, 0)

    // Physics
    this.physicsWorld = new CANNON.World()
    this.physicsWorld.gravity.set(0, -9.81, 0)
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld)
    this.physicsWorld.solver.iterations = 10
    this.physicsWorld.allowSleep = true

    this.parallelPairs = []
    this.physicsFrameRate = 60
    this.physicsFrameTime = 1 / this.physicsFrameRate
    this.physicsMaxPrediction = 1 / this.physicsFrameRate

    // Render Loop
    this.clock = new Clock()
    this.renderDelta = 0
    this.logicDelta = 0
    this.sinceLastFrame = 0
    this.justRendered = false

    // Initialization
    this.inputManager = new InputManager(this, this.renderer.domElement)
    this.cameraOperator = new CameraOperator(this, this.camera, MOUSE_SENSITIVITY)

    this.cannonDebugRenderer = new CannonDebugRenderer( this.graphicsWorld, this.physicsWorld );
 
    this.loadScene(sceneUuid)

    this.render(this)
  }

  update = (timestep: number, unscaledTimestep: number) => {
    this.physicsWorld.step(this.physicsFrameTime, timestep)

    // Update registered objects
    this.updatables.forEach(entity => {
      entity.update(timestep, unscaledTimestep)
    })

    if (this.debugPhysics) {
      this.cannonDebugRenderer.update();
    }
  }

  render = (world: World) => {
    this.requestDelta = this.clock.getDelta()

    requestAnimationFrame(() => {
      world.render(world)
    })

    // Getting time step
    let unscaledTimeStep = (this.requestDelta + this.renderDelta + this.logicDelta)
    let timestep = unscaledTimeStep * 1 // (this.params?.Time_Scale || 1)
    timestep = Math.min(timestep, 1 / 30) // Minimum 30 fps

    // Logic
    world.update(timestep, unscaledTimeStep)

    // Frame Limiting
    let interval = 1 / 60
    this.sinceLastFrame += this.requestDelta + this.renderDelta + this.logicDelta
    this.sinceLastFrame %= interval

    this.renderer.render(this.graphicsWorld, this.camera)

    // Measuring render time
    this.renderDelta = this.clock.getDelta()
  }

  setTimeScale = (value: number) => {
    // this.params['Time_Scale'] = value
    this.timeScaleTarget = value
  }

  add = (worldEntity: IWorldEntity) => {
    worldEntity.addToWorld(this)
    this.registerUpdatable(worldEntity)
  }

  registerUpdatable = (registree: IUpdatable) => {
    this.updatables.push(registree)
    this.updatables.sort((a, b) => a.updateOrder > b.updateOrder ? 1 : -1)
  }

  remove = (worldEntity: IWorldEntity) => {
    if (!worldEntity) {
      return
    }

    worldEntity.removeFromWorld(this)
    this.unregisterUpdatable(worldEntity)
  }

  unregisterUpdatable = (registree: IUpdatable) => {
    _.pull(this.updatables, registree)
  }

  loadScene = (sceneUuid: string) => {
    this.scenario = new Scenario(this, MapStorage.getCurrentMap().uuid)
  }

  clearEntities = () => {
    for (let i = 0; i < this.characters.length; i++) {
      this.remove(this.characters[i])
      i--
    }
  }  

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  initSky = () => {
      this.graphicsWorld.background = new THREE.Color().setHSL( 0.6, 0, 1 );

      // @ts-ignore
      this.graphicsWorld.fog = new THREE.Fog( this.graphicsWorld.background, 1, 5000 );

      // LIGHTS
      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      hemiLight.position.set( 0, 50, 0 );
      this.graphicsWorld.add( hemiLight );

      const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
      this.graphicsWorld.add( hemiLightHelper );

      const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
      dirLight.color.setHSL( 0.1, 1, 0.95 );
      dirLight.position.set( - 1, 1.75, 1 );
      dirLight.position.multiplyScalar( 30 );
      this.graphicsWorld.add( dirLight );

      dirLight.castShadow = true;

      dirLight.shadow.mapSize.width = 2048 / 4;
      dirLight.shadow.mapSize.height = 2048 / 4;

      const d = 50;

      dirLight.shadow.camera.left = - d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = - d;

      dirLight.shadow.camera.far = 3500 / 2;
      dirLight.shadow.bias = - 0.0001;

      const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
      this.graphicsWorld.add( dirLightHelper );

      // SKYDOME
      const vertexShader = document.getElementById( 'vertexShader' ).textContent;
      const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
      const uniforms = {
        "topColor": { value: new THREE.Color( 0x0077ff ) },
        "bottomColor": { value: new THREE.Color( 0xffffff ) },
        "offset": { value: 33 },
        "exponent": { value: 0.6 }
      };
      uniforms[ "topColor" ].value.copy( hemiLight.color );

      this.graphicsWorld.fog.color.copy( uniforms[ "bottomColor" ].value );

      const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
      const skyMat = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
      } );

      const sky = new THREE.Mesh( skyGeo, skyMat );
      this.graphicsWorld.add( sky );
  }
  
}
