import { Object3D, Vector3 } from "three";
import { Space } from "../enums/space";

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
