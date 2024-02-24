export class Avatar {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        console.log("render avatar")

        const tmp = document.createElement('div');
        const template = Handlebars.templates["avatar.hbs"];
        tmp.innerHTML = template(this.#config.avatar);
        this.#parent.appendChild(tmp.firstElementChild);
    }
}
