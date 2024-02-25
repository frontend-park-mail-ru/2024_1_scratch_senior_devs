import "../../../build/main-page.js"
import {NotesContainer} from "../../components/notes/notes.js";
import {NoteEditor} from "../../components/note-editor/note-editor.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {Home} from "../../components/home/home.js";

export default class MainPage {
  #parent;
  #config;

  constructor(parent, config) {
    this.#parent = parent;
    this.#config = config;
  }

  get href () {
    return this.#config.href;
  }

  get self () {
    return document.getElementById('main-page');
  }

  remove(){
    console.log("MainPage remove")
    this.#parent.innerHTML = '';
  }

  render() {
    console.log("MainPage render")

    const tmp = document.createElement('div');
    const template = Handlebars.templates["main-page.hbs"];
    tmp.innerHTML = template(this.#config.mainPage);
    this.#parent.appendChild(tmp.firstElementChild);

    if (AppUserStore.IsAuthenticated()) {
      const notesContainer = new NotesContainer(this.self, this.#config)
      notesContainer.render()

      const noteEditor = new NoteEditor(this.self, this.#config)
      noteEditor.render()
    } else {
      const home = new Home(this.self, this.#config)
      home.render()
    }
  }
}
