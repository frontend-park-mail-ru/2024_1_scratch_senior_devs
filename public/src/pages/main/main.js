import "../../../build/main.js"
import {NotesContainer} from "../../components/notes/notes.js";
import {AppUserStore} from "../../stores/user/userStore.js";
import {Home} from "../../components/home/home.js";

export default class Main {
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
    return document.getElementById('main');
  }

  remove(){
    console.log("Main remove")
    this.#parent.innerHTML = '';
  }

  render() {
    console.log("Main page render")

    const tmp = document.createElement('div');
    const template = Handlebars.templates["main.hbs"];
    tmp.innerHTML = template(this.#config);
    this.#parent.appendChild(tmp.firstElementChild);

    if (AppUserStore.IsAuthenticated()) {
      const notesContainer = new NotesContainer(this.self, this.#config)
      notesContainer.render()
    } else {
      const home = new Home(this.self, this.#config)
      home.render()
    }
  }
}
