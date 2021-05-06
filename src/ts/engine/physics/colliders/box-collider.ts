import { ICollider } from "../../interfaces/ICollider";
import * as CANNON from 'cannon'
import { Mesh, Vector3 } from "three";
import { setDefaults } from "../../utils/function-library";

export class BoxCollider implements ICollider {
  public options: any;
  public body: CANNON.Body
  public debugModel: Mesh

  constructor(options: any) {
    let defaults = {
      mass: 0,
      position: new Vector3(),
      size: new Vector3(0.3, 0.3, 0.3),
      friction: 0.3
    }

    options = setDefaults(options, defaults)
    this.options = options

    options.position = new CANNON.Vec3(options.position.x, options.position.y, options.position.z)
    options.size = new CANNON.Vec3(options.size.x, options.size.y, options.size.z)

    let mat = new CANNON.Material('boxMat')
    mat.friction = options.friction

    let shape = new CANNON.Box(options.size)

    // Add phys sphere
    let physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      shape,
    })

    physBox.material = mat
    this.body = physBox
  }
}
