import "../../../build/input.js"

export class Input {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        const div = document.createElement('div');
        div.className = "input-container"

        const template = Handlebars.templates["input.hbs"];
        div.innerHTML = template(this.#config);

        const input = div.querySelector("input");

        if (this.#config.type === "password") {
            const image = document.createElement("img");
            image.src = "/src/assets/eye-close.svg";
            image.className = "show-password-btn";

            image.addEventListener("click", function () {
                if (input.type === "password") {
                    input.type = "text";
                    image.src = "/src/assets/eye-open.svg";
                } else {
                    input.type = "password";
                    image.src = "/src/assets/eye-close.svg";
                }
            })

            div.appendChild(image);
        }

        this.#parent.appendChild(div);

    }
}
