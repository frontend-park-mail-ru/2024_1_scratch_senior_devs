export default class Page {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @param parent {HTMLElement}  объект родителя
     * @param config {Object} конфиг (пропсы)
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * @returns {string} адрес страницы
     */
    get href () {
        return this.#config.href;
    }

    /**
     * @returns {HTMLElement} объект страницы
     */
    get self () {
        return document.getElementById(this.#config.id);
    }

    /**
     * @returns {Object} конфиг
     */
    get config() {
        return this.#config;
    }

    /**
     * @returns {HTMLElement} объект родителя
     */
    get parent() {
        return this.#parent;
    }

    /**
     * @returns {boolean} нужна ли авторизация для просмотра страницы
     */
    get needAuth() {
        return this.#config.needAuth;
    }

    /**
     * Удаляет объект страницы
     */
    remove(){
        this.self.remove();
    }

    /**
     * Рендерит страницу
     */
    render() {

    }
}
