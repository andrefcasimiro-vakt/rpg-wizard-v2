export interface IResourceMaterial {
  /** The id of the material inside the mesh */
  materialId: string

  materialName: string

  meshName: string

  /** The image path that will be used as the texture of this mesh */
  texture: string | null

  /** If no texture is set, a color will be used instead */
  color: string | null

  /** If we want to use the default texture embedded into the mesh. Example: Mixamo meshes come with textures already setup inside the fbx model. */
  useDefault: boolean
}
