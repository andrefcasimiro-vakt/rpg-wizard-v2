import { AxesHelper, BackSide, BoxGeometry, GridHelper, ImageUtils, Intersection, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, PointLight, Ray, Raycaster, RepeatWrapping, Scene, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from '../../../lib/orbitControls'
import { MapEditor } from "./map-editor";
import _ = require("lodash");
import { IMapEvent } from "../interfaces/IMapEvent";
import { ToolbarEditor } from "./toolbar-editor";
import { ToolbarMode } from "../enums/ToolbarMode";
import { IMapGround } from "../interfaces/IMapGround";
import { getCurrentMap, getCurrentMapUuid } from "../../storage/maps";
import { addOrUpdateEvent } from "../../storage/events";
import shortid = require("shortid");

// Cache
var skyboxGeometry = new BoxGeometry(1000, 1000, 1000)
var skyboxMaterial = new MeshBasicMaterial({ color: 0xffffee, side: BackSide })
var skybox = new Mesh(skyboxGeometry, skyboxMaterial)

var axis = new AxesHelper(33)
axis.position.y = 0.01

var light = new PointLight(0xffffff)
light.position.set(100, 250, 100)

export class SceneEditor {

  public scene: Scene
  public camera: PerspectiveCamera
  public renderer: WebGLRenderer
  private orbitControls: OrbitControls
  private raycaster: Raycaster = new Raycaster()
  private mouse: Vector2 = new Vector2()

  public onIntersection: (intersection: Intersection) => void;
  public onDoubleClickIntersection: (intersection: Intersection) => void;

  // Dependencies
  private mapEditor: MapEditor
  private toolbarEditor: ToolbarEditor

  // Grid
  private squareT: Texture;
  private basePlane: Mesh;

  // UI
  private modal;

  constructor(mapEditor: MapEditor, toolbarEditor: ToolbarEditor) {
    this.mapEditor = mapEditor
    this.toolbarEditor = toolbarEditor
    this.scene = new Scene()

    // Camera
    var SCREEN_WIDTH = window.innerWidth
    var SCREEN_HEIGHT = window.innerHeight
    var VIEW_ANGLE = 45
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    var NEAR = 0.1
    var FAR = 2000
    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    this.camera.position.z = 10
    this.camera.position.y = 5

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
    window.addEventListener('dblclick', this.onDoubleClick, false)

    this.animate()
    this.drawScene()

    this.modal = document.getElementById('modal')
  }

  onDoubleClick = (event: MouseEvent) => {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
  
    this.handleRaycast({ doubleClicked: true })
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

  handleRaycast = (options?: {
    doubleClicked?: boolean,
  }) => {
    if (this.modal?.style?.display != 'none') {
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
      if (options?.doubleClicked) {
        this.onDoubleClickIntersection(intersections[0])
        return
      }

      this.onIntersection(intersections[0])
    }
  }

  drawScene = (options?: {
    queuedGround?: IMapGround,
    queuedEvent?: IMapEvent,
    queuedStartingPosition?: Vector3,
    fillColor?: string
  }) => {
    this.clearScene()
    
    let width = 50
    let depth = 50

    const currentMapLayer = getCurrentMap()?.layers?.[0]
    const currentMapGrounds = currentMapLayer?.grounds || []
    const currentMapEvents = currentMapLayer?.events || []
    const startingPosition = currentMapLayer?.startingPosition || null
    const groundMesh = new Mesh(new BoxGeometry(1, 1, 1))

    const sceneChildren: Mesh[] = []

    let mapStartingPosition: Vector3 | null = null
    const mapGrounds: IMapGround[] = []
    const mapEvents: IMapEvent[] = []

    for (let i = -width / 2; i < width / 2; i++) {
      for (let j = -depth / 2; j < depth / 2; j++) {
        var entry: Mesh;

        // -- STARTING POSITION ------------------------------------------------------------------------------------

        // Has a starting position tile in queue to be painted
        const queuedStartingPosition = options?.queuedStartingPosition
        if (queuedStartingPosition?.x === i && queuedStartingPosition?.z === j) {
          const startingPositionTile = this.getStartingPositionTile(i, j)
          mapStartingPosition = queuedStartingPosition

          if (this.toolbarEditor.mode === ToolbarMode.STARTING_POSITION || this.toolbarEditor.mode === ToolbarMode.EVENT) {
            sceneChildren.push(startingPositionTile)
          }
        }

        // Has found a starting position tile
        if (startingPosition != null && startingPosition.x === i && startingPosition.z === j) {
          const startingPositionTile = this.getStartingPositionTile(i, j)
          mapStartingPosition = startingPosition
          if (this.toolbarEditor.mode === ToolbarMode.STARTING_POSITION || this.toolbarEditor.mode === ToolbarMode.EVENT) {
            sceneChildren.push(startingPositionTile)
          }
        }

        // -- EVENTS ------------------------------------------------------------------------------------

        // Has found an already painted event
        const paintedEvent = currentMapEvents.find((event) => event.position.x === i && event.position.z === j) 
        if (paintedEvent) {
          const eventTile = this.getEventTile(i, j)

          mapEvents.push({ position: eventTile.position, eventUuid: paintedEvent.eventUuid })

          // Only render events if on EVENT MODE
          if (this.toolbarEditor.mode === ToolbarMode.EVENT) {
            sceneChildren.push(eventTile)
          }
        } else {
          // Has event waiting to be painted at this position?
          const queuedEventPosition = options?.queuedEvent?.position
          if (queuedEventPosition?.x === i && queuedEventPosition?.z === j) {
     
            const eventTile = this.getEventTile(i, j)
  
            mapEvents.push({ position: eventTile.position, eventUuid: options?.queuedEvent.eventUuid })
            
            // Only render events if on EVENT MODE
            if (this.toolbarEditor.mode === ToolbarMode.EVENT) {
              sceneChildren.push(eventTile)
            }
  
            // Create event in the storage
            addOrUpdateEvent({
              uuid: options?.queuedEvent?.eventUuid,
              eventPages: [{
                uuid: shortid.generate(),
                switches: [],
                actions: [],
                trigger: null,
              }]
            })
          }  
        }

        // -- GROUNDS ------------------------------------------------------------------------------------

        // Has a ground waiting to be painted at this position?
        const queuedPosition = options?.queuedGround?.position
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

    this.mapEditor.updateMap(
      getCurrentMapUuid(),
      {
        layers: [{ grounds: mapGrounds, events: mapEvents, startingPosition: mapStartingPosition }]
      }
    )
  }

  getStartingPositionTile = (x, z) => {
    const entry = this.basePlane.clone()
    entry.scale.set(.8, .8, .8)
    entry.material = new MeshBasicMaterial({ color: 'orange', transparent: true, opacity: 0.9 })
    entry.position.set(x, 0 + .8, z)
    return entry
  }

  getEventTile = (x, z) => {
    const entry = this.basePlane.clone()
    entry.scale.set(.9, .9, .9)
    entry.material = new MeshBasicMaterial({ color: 'purple', transparent: true, opacity: 0.9 })
    entry.position.set(x, 0 + .5, z)
    return entry
  }

  clearScene = () => {
    this.scene = new Scene()

    this.scene.add(skybox)
    this.scene.add(axis)

    // Ambient light
    this.scene.add(light)
  }
}
