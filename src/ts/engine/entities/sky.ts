import { BackSide, HemisphereLight, Mesh, Object3D, ShaderMaterial, UniformsUtils, Vector3 } from "three";
import { IUpdatable } from "../interfaces/IUpdatable";
import CSM from 'three-csm'
import { World } from "./world";
import { SkyShader } from '../../../lib/shaders/SkyShader'
import { SphereBufferGeometry } from "three";

export class Sky extends Object3D implements IUpdatable {

  public updateOrder = 5;

  public sunPosition = new Vector3()

  public csm: CSM

  private _theta = 145

  set theta(value: number) {
    this._theta = value
    this.refreshSunPosition()
  }

  private _phi = 50

  set phi(value: number) {
    this._phi = value

    this.refreshSunPosition()
    this.refreshHemiIntensity()
  }

  private hemiLight: HemisphereLight
  private maxHemiIntensity = 0.9
  private minHemiIntensity = 0.3

  private skyMesh: Mesh
  private skyMaterial: ShaderMaterial

  private world: World

  constructor(world: World) {
    super()

    this.world = world

    // Sky Material
    this.skyMaterial = new ShaderMaterial({
      uniforms: UniformsUtils.clone(SkyShader.uniforms),
      fragmentShader: SkyShader.fragmentShader,
      vertexShader: SkyShader.vertexShader,
      side: BackSide
    })

    // Sky Mesh
    this.skyMesh = new Mesh(
      new SphereBufferGeometry(1000, 24, 12),
      this.skyMaterial
    )

    this.attach(this.skyMesh)

    // Ambient Light
    this.hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.1)
    this.refreshHemiIntensity()
    this.hemiLight.color.setHSL(.59, .4, .6)
    this.hemiLight.groundColor.setHSL(0.095, 0.2, 0.75)
    this.hemiLight.position.set(0, 50, 0)
    this.world.graphicsWorld.add(this.hemiLight)

    // Legacy
    let splitsCallback = (amount, near, far) => {
      let arr = []
      for (let i = amount - 1; i >= 0; i--) {
        arr.push(Math.pow(1 / 4, i))
      }
      return arr
    }

    this.csm = new CSM({
      fov: 80,
      far: 250,
      lightIntensity: 2.5,
      cascades: 3,
      shadowMapSize: 1024,
      camera: this.world.camera,
      parent: this.world.graphicsWorld,
      mode: 'custom',
      customSplitsCallback: splitsCallback,
    })

    this.csm.fade = true

    this.refreshSunPosition()

    this.world.graphicsWorld.add(this)
    this.world.registerUpdatable(this)
  }

  update = () => {
    this.position.copy(this.world.camera.position)
    this.refreshSunPosition()

    this.csm.update(this.world.camera.matrix)
    this.csm.lightDirection = new Vector3(
      -this.sunPosition.x,
      -this.sunPosition.y,
      -this.sunPosition.z
    ).normalize()
  }

  refreshSunPosition = () => {
    const sunDistance = 10
    this.sunPosition.x = sunDistance * Math.sin(this._theta * Math.PI / 180) * Math.cos(this._phi * Math.PI / 180)
    this.sunPosition.y = sunDistance * Math.sin(this._phi * Math.PI / 180)
    this.sunPosition.z = sunDistance * Math.cos(this._theta * Math.PI / 180) * Math.cos(this._phi * Math.PI / 180)

    this.skyMaterial.uniforms.sunPosition.value.copy(this.sunPosition)
    this.skyMaterial.uniforms.cameraPos.value.copy(this.world.camera.position)
  }

  refreshHemiIntensity = () => {
    this.hemiLight.intensity = this.minHemiIntensity + Math.pow(1 - (Math.abs(this._phi - 90) / 90), 0.25) * (this.maxHemiIntensity - this.minHemiIntensity)
  }
}
