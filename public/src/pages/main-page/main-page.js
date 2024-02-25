import {NotesContainer} from "../../components/notes/notes.js";
import {NoteEditor} from "../../components/note-editor/note-editor.js";
import {Home} from "../../components/home/home.js";
import "../../../build/main-page.js"

export default class MainPage {
  #parent;
  #config;
  #user;

  constructor(parent, config, user) {
    this.#parent = parent;
    this.#config = config;
    this.#user = user;
  }

  render() {
    this.#parent.innerHTML = '';

    const tmp = document.createElement('div');
    const template = Handlebars.templates["main-page.hbs"];
    tmp.innerHTML = template(this.#config.mainPage);
    this.#parent.appendChild(tmp.firstElementChild);

    const self = document.getElementById('main-page');


    if (this.#user.isAuthorized) {
      const notesContainer = new NotesContainer(self, this.#config)
      notesContainer.render()

      const noteEditor = new NoteEditor(self, this.#config)
      noteEditor.render()
    } else {
      const home = new Home(self, this.#config)
      home.render()
    }
  }
}
