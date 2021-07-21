import { addResource, getResources, setResources, updateResource } from "src/ts/storage/resources";
import { IResource } from "../../interfaces/IResource";
import { createElement } from "../../utils/ui";
import { Modal } from "../modal";
import { AssetManager } from "./asset-manager/asset-manager";
import { CharacterManager } from "./asset-manager/character-manager/character-manager";
import { PropManager } from "./asset-manager/prop-manager/prop-manager";
import { TextureManager } from "./asset-manager/texture-manager/texture-manager";
import * as styles from './resource-manager.css'

// Keys must match Resources interface on src/ts/storage/resources
export const resourcePaths = {
  characters: 'graphics/characters',
  props: 'graphics/props',
  textures: 'graphics/textures',
  fx: 'graphics/fx',
  bgm: 'sound/bgm',
  se: 'sound/se',
}

export const assetManagers = {
  characters: CharacterManager,
  props: PropManager,
  textures: TextureManager,
  fx: AssetManager,
  bgm: AssetManager,
  se: AssetManager,
}

const HASH = 'resources'

export class ResourceManager {

  public onResourceSelection: (resource) => void;

  selectedResourceFolder: string

  selectedResourceUuid: string

  allowedFolder: string = null

  constructor() {
    window.addEventListener('hashchange', () => {
      this.handleHashChange()
    })

    // Need to call at the beginning as well
    this.handleHashChange()
  }

  handleHashChange = () => {
    if (window.location.hash.includes(HASH)) {
      Modal.open(this.getGui())

      this.handleSelection(window.location.hash)
    }
  }

  handleSelection = (hash: string) => {
    const paths = Object.keys(resourcePaths)

    const targetFolder = paths.find(path => hash.includes(path))

    if (targetFolder) {
      this.selectedResourceFolder = targetFolder

      const folderResources = (getResources()?.[targetFolder] || []) as IResource[]
      const selectedResource = folderResources.find(resource => hash.includes(resource.uuid))
      this.selectedResourceUuid = selectedResource?.uuid

      if (hash.includes('mode=edit')) {
        this.updateAsset()
      }

      this.update()
    }
  }

  open = (folderPath = Object.keys(resourcePaths)[0]) => {
    window.location.hash = `${HASH}&category=${folderPath}`
  }

  getGui = (): HTMLElement => {
    const container = createElement('div', styles.container)

    const headerText = createElement('h2', '')
    headerText.innerHTML = 'Resource Manager'
    container.appendChild(headerText)

    const grid = createElement('div', styles.grid)
    container.appendChild(grid)

    const folders = createElement('ul', styles.folders)
    grid.appendChild(folders)

    Object.entries(resourcePaths).forEach(resourcePath => {
      const folderContainer = createElement('li', styles.folderContainer)
      folders.appendChild(folderContainer)

      const folderButton = createElement('button', styles.folderButton) as HTMLButtonElement
      
      if (this.selectedResourceFolder == resourcePath[0]) {
        folderButton.className = `${styles.folderButton} ${styles.folderButtonActive}`
      }
      
      folderContainer.appendChild(folderButton)
      folderButton.innerHTML = resourcePath[1]
      folderButton.onclick = () => this.handleSelectedResourceFolder(resourcePath[0])

      console.log(this.allowedFolder, resourcePath[0])
      if (this.allowedFolder && this.allowedFolder !== `graphics/${resourcePath[0]}`) {
        folderButton.disabled = true  
      }
    })

    const resourceList: IResource[] = getResources()?.[this.selectedResourceFolder] || []

    const files = createElement('ul', styles.folders)
    grid.appendChild(files)

    resourceList.forEach(resource => {
      const fileContainer = createElement('li', styles.folderContainer)
      files.appendChild(fileContainer)

      const fileButton = createElement('button', styles.folderButton) as HTMLButtonElement
      
      if (this.selectedResourceUuid == resource.uuid) {
        fileButton.className = `${styles.folderButton} ${styles.folderButtonActive}`
      }
      
      fileButton.innerHTML = `
      <div style="display:flex; flex-direction:column;">
        <strong>${resource.displayName}</strong>
        <em>${ resource.downloadUrl }</em>
      </div>`
      fileButton.onclick = () => this.handleResourceSelection(resource.uuid)
      fileContainer.appendChild(fileButton)
    })

    const sidebarToolbarContainer = createElement('div', styles.sidebarToolbarContainer)
    grid.appendChild(sidebarToolbarContainer)

    const addResourceButton = createElement('button', styles.button) as HTMLButtonElement
    addResourceButton.innerHTML = 'Add resource'
    addResourceButton.disabled = !this.selectedResourceFolder
    addResourceButton.onclick = this.addAsset
    sidebarToolbarContainer.appendChild(addResourceButton)

    const editResourceButton = createElement('button', styles.button) as HTMLButtonElement
    editResourceButton.innerHTML = 'Edit resource'
    editResourceButton.disabled = !this.selectedResourceUuid
    editResourceButton.onclick = this.handleAssetToUpdate
    sidebarToolbarContainer.appendChild(editResourceButton)

    const removeResourceButton = createElement('button', styles.button) as HTMLButtonElement
    removeResourceButton.innerHTML = 'Remove resource'
    removeResourceButton.disabled = !this.selectedResourceUuid
    removeResourceButton.onclick = this.handleRemoveResource
    sidebarToolbarContainer.appendChild(removeResourceButton)

    if (this.onResourceSelection) {
      const saveBtn = createElement('button', '') as HTMLButtonElement
      saveBtn.innerHTML = 'Select resource'
      saveBtn.disabled = !this.selectedResourceUuid
      
      saveBtn.onclick = () => {
        const resourceFolder = getResources()?.[this.selectedResourceFolder] as IResource[] || []
        this.onResourceSelection(resourceFolder.find(x => x.uuid == this.selectedResourceUuid))
      }
      container.appendChild(saveBtn)
    }

    return container
  }

  update = () => {
    Modal.refresh(this.getGui())
  }

  handleSelectedResourceFolder = (nextFolder: string) => {
    this.selectedResourceUuid = null
    window.location.hash = `${HASH}&category=${nextFolder}`
  }

  handleResourceSelection = (uuid: string) => {
    window.location.hash = `${HASH}&category=${this.selectedResourceFolder}&resource=${uuid}`
  }

  addAsset = () => {
    const Manager = assetManagers[this.selectedResourceFolder] as typeof AssetManager
    const instance = new Manager(this.selectedResourceFolder)
    
    instance.handleOnSave = (payload: IResource) => {
      this.handleChangesToResource(payload, 'add', instance)
    }

    instance.open()
  }

  handleAssetToUpdate = () => {
    window.location.hash = `${HASH}&category=${this.selectedResourceFolder}&resource=${this.selectedResourceUuid}&mode=edit`
  }

  updateAsset = () => {
    const Manager = assetManagers[this.selectedResourceFolder] as typeof AssetManager
    const instance = new Manager(this.selectedResourceFolder)
    
    instance.handleOnSave = (payload: IResource) => {
      this.handleChangesToResource(payload, 'update', instance)
    }

    const resources = getResources()?.[this.selectedResourceFolder] as IResource[]
    const payload = resources.find(x => x.uuid == this.selectedResourceUuid)

    instance.assetUuid = payload.uuid
    instance.assetName = payload.displayName
    instance.assetUrl = payload.downloadUrl

    instance.open()

    instance.onClose = () => {
      const nextState = window.location.hash
      window.location.hash = nextState.replace('&mode=edit', '')
    }
  }

  handleChangesToResource = (payload: IResource, type: 'add' | 'update', instance) => {
    const callback = type === 'add' ? addResource : updateResource

    // @ts-ignore
    callback(payload, this.selectedResourceFolder)

    instance.close()
    this.update()
  }

  handleRemoveResource = () => {
    const allResources = getResources()
    allResources[this.selectedResourceFolder] = allResources[this.selectedResourceFolder].filter(x => x.uuid !== this.selectedResourceUuid)
    setResources(allResources)
    this.update()
  }

  close = () => {
    Modal.close()
  }

}
