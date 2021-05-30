import shortid = require("shortid");
import { Editor } from "./editor/editor";
import { World } from "./engine/entities/world";
import { initializeStore } from "./storage/utils";

export class App {

  constructor() {
    if (window.location.search.includes('?mode=game')) {
      new World()
    } else {
      initializeStore()

      new Editor();
    }

    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        window.location.search = ''
      }
    })
  }
}
