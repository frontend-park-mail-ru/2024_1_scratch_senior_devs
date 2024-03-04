export default class Page {
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
        return document.getElementById(this.#config.id);
    }

    get config() {
        return this.#config;
    }

    get parent() {
        return this.#parent;
    }

    get needAuth() {
        return this.#config.needAuth;
    }

    remove(){
        this.self.remove();
    }

    render() {

    }
}
