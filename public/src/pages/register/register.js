export default class RegisterPage {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        this.#parent.innerHTML = '';

        this.#parent.insertAdjacentHTML('beforeend', window.Handlebars.templates['register.hbs'](this.#config.registerPage));
    }
}
