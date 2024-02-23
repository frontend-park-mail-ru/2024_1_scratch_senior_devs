export default class MainPage {
  #parent;
  #config;

  constructor(parent, config) {
    this.#parent = parent;
    this.#config = config;
  }

  render() {
    this.#parent.innerHTML = '';

    this.#parent.insertAdjacentHTML('beforeend', window.Handlebars.templates['main-page.hbs'](this.#config.mainPage));
  }
}
