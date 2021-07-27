import _ = require("lodash");
import { AdditiveBlending, BackSide, Blending, DoubleSide, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, Quaternion, RepeatWrapping, SrcAlphaFactor, TextureLoader, Vector3 } from "three";
import { Space } from "../enums/space";
import { SimulationFrame } from "../physics/spring-simulation/simulation-frame";
import * as CANNON from 'cannon'
import { getResources } from "src/ts/storage/resources";
import { IResourceModel } from "src/ts/editor/interfaces/IResourceModel";
import { IResourceMaterial } from "src/ts/editor/interfaces/IResourceMaterial";
import THREE = require("three");

// Mesh
export function setupMeshProperties(child: Object3D): void {
  child.castShadow = true 
  child.receiveShadow = true

  // @ts-ignore
  let material: MeshStandardMaterial | MeshStandardMaterial[] = child?.material

  if (!material) {
    return;
  }

  if (Array.isArray(material)) {
    // @ts-ignore
    child?.material.forEach((childMat, index) => {
      const material = setupMeshMaterial(childMat)

      // @ts-ignore
      child?.material[index] = material
    })
  } else {
    // @ts-ignore
    const material = setupMeshMaterial(child?.material)
    // @ts-ignore
    child?.material = material
  }

  if (child?.children?.length) {
    child?.children?.forEach(setupMeshProperties)
  }
}

function setupMeshMaterial(meshMaterial: MeshStandardMaterial) {

  const meshResources = [...getResources().characters, ...getResources().props] as IResourceModel[]
  var resourceMaterial: IResourceMaterial

  for (const meshResource of meshResources) {
    const match = meshResource.materials?.find(resourceMaterial => resourceMaterial?.materialName == meshMaterial?.name)

    if (match) {
      resourceMaterial = match
      break
    }
  }

  if (resourceMaterial?.useDefault) {
    const mat: any = meshMaterial.clone()
    mat.shininess = 0
    mat.map.anisotropy = 4
    return mat
  }
  
  if (resourceMaterial?.texture) {
    var squareT = new TextureLoader().load(resourceMaterial?.texture)
    squareT.wrapS = RepeatWrapping
    squareT.repeat.set(1, 1)

    const textureMaterial = new MeshLambertMaterial({
      map: squareT,
      emissiveIntensity: 1,
      transparent: true,
    })
    // @ts-ignore
    textureMaterial.shininess = 0

    return textureMaterial
  }

  if (resourceMaterial?.color) {
    // @ts-ignore
    var mat = new MeshStandardMaterial({ color: resourceMaterial.color})

    return mat
  }

  return meshMaterial
}

// Angles
export function getAngleBetweenVectors(v1: Vector3, v2: Vector3, dotTreshold = 0.0005): number {
  let angle: number
  let dot = v1.dot(v2)

  // If dot is close to 1, we'll round angle to zero
  if (dot > 1 - dotTreshold) {
    angle = 0
  } else {
    // Dot too close to -1
    if (dot < -1 + dotTreshold) {
      angle = Math.PI
    } else {
      // Get angle difference in radians
      angle = Math.acos(dot)
    }
  }

  return angle
}

export function getSignedAngleBetweenVectors(v1: Vector3, v2: Vector3, normal: Vector3 = new Vector3(0, 1, 0), dotTreshold = 0.0005): number {
  let angle = this.getAngleBetweenVectors(v1, v2, dotTreshold)

  // Get vector pointing up or down
  let cross = new Vector3().crossVectors(v1, v2)

  // Compare cross with normal to find out direction
  if (normal.dot(cross) < 0) {
    angle = -angle
  }

  return angle
}

// Generic
export function setDefaults(options: {}, defaults: {}): {} {
  return _.defaults({}, _.clone(options), defaults)
}

export function haveSameSigns(n1: number, n2: number): boolean {
  return (n1 < 0) === (n2 < 0)
}

export function haveDifferentSigns(n1: number, n2: number): boolean {
  return (n1 < 0) !== (n2 < 0)
}

// Physics
export function spring(source: number, destination: number, velocity: number, mass: number, damping: number): SimulationFrame {
  let acceleration = destination - source
  acceleration /= mass
  velocity += acceleration
  velocity *= damping

  let position = source + velocity
  return new SimulationFrame(position, velocity)
}

export function springV(source: Vector3, destination: Vector3, velocity: Vector3, mass: number, damping: number): void {
  let acceleration = new Vector3().subVectors(destination, source)
  acceleration.divideScalar(mass)
  velocity.add(acceleration);

  velocity.multiplyScalar(damping)
  source.add(velocity)
}

// Vectors
export function applyVectorMatrixXZ(a: Vector3, b: Vector3): Vector3 {
  return new Vector3(
    (a.x * b.z + a.z * b.x),
    b.y,
    (a.z * b.z + (-a.x * b.x))
  )
}

export function threeVector(vec: CANNON.Vec3): Vector3 {
  return new Vector3(vec.x, vec.y, vec.z)
}

export function cannonVector(vec: Vector3): CANNON.Vec3 {
  return new CANNON.Vec3(vec.x, vec.y, vec.z)
}

export function cannonQuaternion(quat: Quaternion): CANNON.Quaternion {
  return new CANNON.Quaternion(quat.x, quat.y, quat.z, quat.w)
}

export function getMatrix(obj: Object3D, space: Space) {
  switch (space) {
    case Space.Local: return obj.matrix
    case Space.Global: return obj.matrixWorld
  }
}

export function getRight(obj: Object3D, space: Space = Space.Global) {
  const matrix = getMatrix(obj, space) 

  return new Vector3(
    matrix.elements[0],
    matrix.elements[1],
    matrix.elements[2]
  )
}

export function getUp(obj: Object3D, space: Space = Space.Global) {
  const matrix = getMatrix(obj, space) 

  return new Vector3(
    matrix.elements[4],
    matrix.elements[5],
    matrix.elements[6]
  )
}

export function getForward(obj: Object3D, space: Space = Space.Global) {
  const matrix = getMatrix(obj, space) 

  return new Vector3(
    matrix.elements[8],
    matrix.elements[9],
    matrix.elements[10]
  )
}

export function getBack(obj: Object3D, space: Space = Space.Global) {
  const matrix = getMatrix(obj, space) 

  return new Vector3(
    -matrix.elements[8],
    -matrix.elements[9],
    -matrix.elements[10]
  )
}
