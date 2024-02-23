export class Header {
    #parent;

    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        this.#parent.insertAdjacentHTML('beforebegin', window.Handlebars.templates['header.hbs'](this.#config.header));
    }
}
