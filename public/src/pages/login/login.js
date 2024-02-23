export default class LoginPage {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        this.#parent.innerHTML = '';

        this.#parent.insertAdjacentHTML('beforeend', window.Handlebars.templates['login.hbs'](this.#config.login));
    }
}
