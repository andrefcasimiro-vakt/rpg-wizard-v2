import { Theme } from "../config/theme";
import { DatabaseIcon } from "../icons/database-icon";
import { EventModeIcon } from "../icons/event-mode-icon";
import { LoadIcon } from "../icons/load-icon";
import { PencilIcon } from "../icons/pencil-icon";
import { SaveIcon } from "../icons/save-icon";
import { IEditor } from "../interfaces/IEditor";
import { ToolbarMode } from "../interfaces/ToolbarMode";
import { DatabaseTabs } from "../utils/database";

export class ToolbarEditor implements IEditor {
  
  public uiContainer: HTMLElement

  public toolbarPanelGUI: HTMLElement

  public saveButtonGUI: HTMLElement
  public onSave: () => void;

  public loadButtonGUI: HTMLElement
  public onLoad: () => void;

  private _mode: ToolbarMode = ToolbarMode.DRAW

  public get mode() {
    return this._mode
  }

  public set mode(value: ToolbarMode) {
    this._mode = value

    this.refreshButtons()
  }

  constructor(uiContainer: HTMLElement) {
    this.uiContainer = uiContainer

    this.drawGui()
  }

  drawGui = () => {
    this.toolbarPanelGUI = document.createElement('ul')
    const style = this.toolbarPanelGUI.style
    style.display = 'flex'
    style.width = '100%'
    style.height = '100%'
    style.backgroundImage = `linear-gradient(to top, ${Theme.PRIMARY}, ${Theme.PRIMARY_DARK})`
    style.borderBottom = `1px solid ${Theme.PRIMARY_DARK}`

    this.refreshButtons();

    this.uiContainer.appendChild(this.toolbarPanelGUI)
  }

  refreshButtons = () => {
    this.toolbarPanelGUI.innerHTML = ''

    this.toolbarPanelGUI.appendChild(this.createButton('Save', SaveIcon(1.5), this.save))
    this.toolbarPanelGUI.appendChild(this.createButton('Load', LoadIcon(1.5), this.load))
    this.toolbarPanelGUI.appendChild(this.createButton('Database', DatabaseIcon(1.5), this.openDatabase))

    const paintBtn = this.createButton(
      'Paint Mode (Left Shift)',
      PencilIcon(1.5),
      this.paintMode,
    )
    paintBtn.style.opacity = this.mode === ToolbarMode.DRAW ? '1' : '.5'
    this.toolbarPanelGUI.appendChild(paintBtn)

    const eventBtn = this.createButton(
      'Event Mode',
      EventModeIcon(1.5),
      this.eventMode,
    )
    eventBtn.style.opacity = this.mode === ToolbarMode.EVENT ? '1' : '.5'
    this.toolbarPanelGUI.appendChild(eventBtn)
  }

  createButton = (label: string, icon: string, onClick: () => void) => {
    const btn = document.createElement('button')
    const style = btn.style
    style.border = `1px solid ${Theme.PRIMARY_DARK}`
    style.display = 'flex'
    style.alignItems = 'center'
    style.justifyContent = 'center'
    style.margin = '10px 5px'
    style.width = '35px'
    style.cursor = 'pointer'
    
    btn.title = label

    btn.onclick = onClick
    btn.innerHTML = `${icon}`

    return btn
  }

  save = () => {
    if (this.onSave) {
      this.onSave()
    }
  }

  load = () => {
    if (this.onLoad) {
      this.onLoad()
    }
  }

  openDatabase = () => {
    window.location.hash = DatabaseTabs.Actors
  }

  paintMode = () => {
    if (this.mode === ToolbarMode.DRAW) {
      return;
    }

    this.mode = ToolbarMode.DRAW
  }

  eventMode = () => {
    if (this.mode === ToolbarMode.EVENT) {
      return;
    }

    this.mode = ToolbarMode.EVENT
  }
}
