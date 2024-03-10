import "../../../build/image.js";

export class Image {
    #parent;
    #config;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self() {
        return document.getElementById(this.#config.id);
    }

    /**
     * Обновляем атрибут src у картинки
     * @param path
     */
    updateImage(path) {
        this.self.src = path;
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["image.hbs"](this.#config)
        );

        if (this.#config.src) {
            this.updateImage(this.#config.src);
        }
    }
}
