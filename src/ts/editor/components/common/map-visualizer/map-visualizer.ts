import { EntityLoader } from "src/ts/editor/components/entity-loader/entity-loader";
import { SceneRenderer } from "src/ts/editor/components/scene-renderer/scene-renderer";
import { IMap } from "src/ts/editor/interfaces/IMap";
import { MapStorage } from "src/ts/storage";
import { BoxGeometry, Intersection, Mesh, MeshBasicMaterial, MeshStandardMaterial, RepeatWrapping, Scene, Texture, TextureLoader, Vector3 } from "three";

const PLACEHOLDER_TILE_NAME = 'PLACEHOLDER_TILE_NAME'

export class MapVisualizer extends SceneRenderer {

  groundMesh: Mesh
  squareT: Texture;
  basePlane: Mesh;
  basePlaneTransparent: Mesh;
  
  brush: Mesh

  entityLoader: EntityLoader;

  currentMap: IMap = null

  currentLayer = 0

  showGrid = true

  onIntersect: (nextPosition: Vector3) => void = () => {}

  constructor(container: HTMLElement, canvasWidth: number, canvasHeight: number) {
    super(container, canvasWidth, canvasHeight, { ambientLightColor: '#FFF', skyboxColor: '#FFF' })

    this.entityLoader = new EntityLoader()

    this.initGridSettings()

    this.renderScene()

    window.addEventListener('keydown', this.handleKeys)
  }

  onMapSelected = (nextMapUuid: string) => {
    this.currentMap = MapStorage.get().find(map => map.uuid === nextMapUuid)

    this.renderScene()
  }

  initGridSettings = () => {
    this.groundMesh = new Mesh(new BoxGeometry(1, 1, 1))
    this.groundMesh.castShadow = true
    this.groundMesh.receiveShadow = true

    this.squareT = new TextureLoader().load('build/assets/square-thick.png')
    this.squareT.wrapS = RepeatWrapping
    this.squareT.repeat.set(1, 1)

    var planeGeo = new BoxGeometry(1, 1, 1)
    planeGeo.scale(1, 1, 1)
    var planeMat = new MeshBasicMaterial({ transparent: true, map: this.squareT, color: 0xbbbbbb, opacity: 0.009 })
    this.basePlane = new Mesh(planeGeo, planeMat)
    this.basePlane.rotation.x = -Math.PI / 2

    this.basePlaneTransparent = this.basePlane.clone()
    this.basePlaneTransparent.material = new MeshBasicMaterial({ transparent: true, opacity: 0 })
  }

  update = () => {
    super.update()

    this.handleRaycast()
  }

  handleRaycast = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    const intersectionObjects = this.scene.children.filter(x =>
        x.name == PLACEHOLDER_TILE_NAME
    )

    const intersections = this
      .raycaster
      .intersectObjects(intersectionObjects)

    // Capture the first intersection only
    if (intersections?.length) {
      this.onIntersection(intersections[0])
    }
  }

  onIntersection = (intersection: Intersection) => {
    var intersectionPosition = intersection.point.round()

    var nextPosition = intersectionPosition.clone()
    nextPosition.y = this.currentLayer

    this.onIntersect(nextPosition)
  }

  renderGrid = () => {
    const mapWidth = this.currentMap.settings?.width
    const mapDepth = this.currentMap.settings?.depth
    const mapHeight = 10

    for (let i = -mapWidth / 2; i < mapWidth / 2; i++) {
      for (let j = -mapDepth / 2; j < mapDepth / 2; j++) {
        for (let h = -mapHeight / 2; h < mapHeight / 2; h++) {
          var placeholderTile = this.showGrid ? this.basePlane.clone() : this.basePlaneTransparent.clone()

          placeholderTile.position.set(i, this.currentLayer, j)
          placeholderTile.name = PLACEHOLDER_TILE_NAME
          this.scene.add(placeholderTile)
        }
      }
    }
  }

  renderGrounds = () => {
    const currentMapGrounds = this.currentMap.grounds || []

    const groundMaterial = new MeshStandardMaterial()

    currentMapGrounds.forEach(ground => {
      var entry = this.groundMesh.clone()
      const { x, y , z } = ground.position
      entry.position.set(x, y, z)

      const groundTexture = this.entityLoader.entityTextureBank?.[ground?.entityUuid]

      if (groundTexture?.wrapS) {
        groundTexture.wrapS = RepeatWrapping
        groundTexture.repeat.set(1, 1)
      }
      entry.material = groundMaterial.clone()
      // @ts-ignore
      entry.material.map = groundTexture

      this.scene.add(entry)
    })
  }

  renderProps = () => {
    const currentMapProps = this.currentMap?.props || []
    currentMapProps.forEach(mapProp => {
      const prop = this.entityLoader.entityPropBank?.[mapProp?.entityUuid]?.clone()
      if (!prop) {
        return
      }

      prop.position.set(mapProp.position.x, mapProp.position.y, mapProp.position.z)
      this.scene.add(prop)
    })
  }

  renderStartingPosition = () => {
    const startingPosition = MapStorage.getStartingPosition()
    if (startingPosition == null) {
      return
    }

    var entry = this.groundMesh.clone()
    entry.position.set(startingPosition.x, startingPosition.y + 0.01, startingPosition.z)
    entry.material = new MeshBasicMaterial({ color: 'yellow', opacity: 0.9, transparent: true })
    this.scene.add(entry)
  }

  renderScene() {
    this.clearScene()

    if (!this.currentMap) {
      return;
    }

    this.renderGrid()
    this.renderGrounds()
    this.renderProps()

    this.renderStartingPosition()

    this.scene.add(this.ambientLight)
    this.scene.add(this.skybox)
  }

  clearScene = () => {
    this.scene = new Scene()
  }

  handleKeys = (evt: KeyboardEvent) => {
    if (evt.code == 'ArrowUp') {
      this.currentLayer += 1

      this.renderScene()
    }

    if (evt.code == 'ArrowDown') {
      this.currentLayer -= 1

      this.renderScene()
    }

    if (evt.code == 'KeyH') {
      this.showGrid = !this.showGrid
      this.renderScene()
    }
    
  }

}
