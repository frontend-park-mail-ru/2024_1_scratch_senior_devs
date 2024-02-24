export class Link {
    #parent;
    #config;
    #isAuth;

    constructor(parent, config, isAuth) {
        this.#parent = parent;
        this.#config = config;
        this.#isAuth = isAuth;
    }

    render() {
        if (this.#config.needAuth && !this.#isAuth) {
            return
        }

        if (!this.#config.needAuth && this.#isAuth) {
            return
        }

        const tmp = document.createElement('div');
        const template = Handlebars.templates["link.hbs"];
        tmp.innerHTML = template(this.#config);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}
