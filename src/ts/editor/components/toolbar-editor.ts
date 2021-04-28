import { Theme } from "../config/theme";
import { DatabaseIcon } from "../icons/database-icon";
import { EventModeIcon } from "../icons/event-mode-icon";
import { FillIcon } from "../icons/fill-icon";
import { LoadIcon } from "../icons/load-icon";
import { PencilIcon } from "../icons/pencil-icon";
import { SaveIcon } from "../icons/save-icon";
import { IEditor } from "../interfaces/IEditor";
import { ToolbarMode } from "../enums/ToolbarMode";
import { DatabaseTabs } from "../utils/database";
import { StartingPositionIcon } from "../icons/starting-position";
import { PlayIcon } from "../icons/play-icon";

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

    if (this.onModeChange) {
      this.onModeChange()
    }

    this.refreshButtons()
  }

  public onModeChange: () => void;

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

    // Play Mode Button
    const playBtn = this.createButton(
      'Play Mode',
      PlayIcon(1.5),
      () => window.location.assign('?mode=game') // window.open('?mode=game'),
    )
    this.toolbarPanelGUI.appendChild(playBtn)


    this.toolbarPanelGUI.appendChild(this.createButton('Save', SaveIcon(1.5), this.save))
    this.toolbarPanelGUI.appendChild(this.createButton('Load', LoadIcon(1.5), this.load))
    this.toolbarPanelGUI.appendChild(this.createButton('Database', DatabaseIcon(1.5), this.openDatabase))

    // Paint BTN
    const paintBtn = this.createButton(
      'Paint Mode',
      PencilIcon(1.5),
      this.paintMode,
    )
    paintBtn.style.opacity = this.mode === ToolbarMode.DRAW ? '1' : '.5'
    this.toolbarPanelGUI.appendChild(paintBtn)

    // Event BTN
    // const fillBtn = this.createButton(
    //   'Fill Mode',
    //   FillIcon(1.5),
    //   this.fillMode,
    // )
    // fillBtn.style.opacity = this.mode === ToolbarMode.FILL ? '1' : '.5'
    // this.toolbarPanelGUI.appendChild(fillBtn)

    // Event BTN
    const eventBtn = this.createButton(
      'Event Mode',
      EventModeIcon(1.5),
      this.eventMode,
    )
    eventBtn.style.opacity = this.mode === ToolbarMode.EVENT ? '1' : '.5'
    this.toolbarPanelGUI.appendChild(eventBtn)

    // Starting Position
    const startingPositionBtn = this.createButton(
      'Set player starting position',
      StartingPositionIcon(1.5),
      this.startingPositionMode,
    )
    startingPositionBtn.style.opacity = this.mode === ToolbarMode.STARTING_POSITION ? '1' : '.5'
    this.toolbarPanelGUI.appendChild(startingPositionBtn)

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

  fillMode = () => {
    if (this.mode === ToolbarMode.FILL) {
      return;
    }

    this.mode = ToolbarMode.FILL
  }

  eventMode = () => {
    if (this.mode === ToolbarMode.EVENT) {
      return;
    }

    this.mode = ToolbarMode.EVENT
  }

  startingPositionMode = () => {
    if (this.mode === ToolbarMode.STARTING_POSITION) {
      return;
    }

    this.mode = ToolbarMode.STARTING_POSITION
  }
}
