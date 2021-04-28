import { Editor } from "./editor/editor";
import { World } from "./engine/entities/world";

export class App {

  constructor() {
    if (window.location.search.includes('?mode=game')) {
      new World()
    } else {
      new Editor();
    }

    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        window.location.search = ''
      }
    })
  }
}
