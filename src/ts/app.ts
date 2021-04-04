import { Editor } from "./editor/editor";

export class App {
  private mode: 'game' | 'editor' = 'editor';
  private editor: Editor;

  constructor() {
    this.editor = new Editor();

    this.init()
  }

  init() {

  }
}
