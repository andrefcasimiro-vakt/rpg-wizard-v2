import { ACESFilmicToneMapping, BoxGeometry, Clock, MathUtils, Mesh, Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Sky } from "./sky";
import * as CANNON from 'cannon'
import { IUpdatable } from "../interfaces/IUpdatable";
import { IWorldEntity } from "../interfaces/IWorldEntity";
import _ = require("lodash");
import { InputManager } from "../core/input-manager";
import { LoadingManager } from "../core/loading-manager";
import { CameraOperator } from "../core/camera-operator";

const MOUSE_SENSITIVITY = 0.3

export class World {
  public renderer: WebGLRenderer
  public camera: PerspectiveCamera
  public graphicsWorld: Scene
  public sky: Sky
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
  public loadingManager: LoadingManager
  public timeScaleTarget = 1
  public updatables: IUpdatable[] = []
  
  private lastScenarioID: string

  constructor(sceneUuid?: string) {
    // Renderer
    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap

    window.addEventListener('resize', this.onWindowResize, false)
  
    // Scene
    this.graphicsWorld = new Scene()
    this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1010)
  
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
    this.sky = new Sky(this)

    this.loadingManager = new LoadingManager(this)

    this.loadScene(sceneUuid)
    this.render(this)
  }

  update = (timestep: number, unscaledTimestep: number) => {
    this.updatePhysics(timestep)

    // Update registered objects
    this.updatables.forEach(entity => {
      entity.update(timestep, unscaledTimestep)
    })

    // Lerp time scale
    this.params.Time_Scale = MathUtils.lerp(this.params.Time_Scale, this.timeScaleTarget, 0.2)
  }

  updatePhysics = (timestep: number) => {
    this.physicsWorld.step(this.physicsFrameTime, timestep)
  }

  render = (world: World) => {
    this.requestDelta = this.clock.getDelta()

    requestAnimationFrame(() => {
      world.render(world)
    })

    // Getting time step
    let unscaledTimeStep = (this.requestDelta + this.renderDelta + this.logicDelta)
    let timestep = unscaledTimeStep * this.params.Time_Scale
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
    this.params.Time_Scale = value
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
    worldEntity.removeFromWorld(this)
    this.unregisterUpdatable(worldEntity)
  }

  unregisterUpdatable = (registree: IUpdatable) => {
    _.pull(this.updatables, registree)
  }

  loadScene = (sceneUuid: string) => {
    const scene = new Object3D()
    // this.loadingManager.onFinishedCallback = () => {
    //   this.update(1, 1)
    //   this.setTimeScale(1)
    // }

    // Load scene from storage and add physic colliders

    this.graphicsWorld.add(scene)
  }

  clearEntities = () => {
    
  }

  

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
