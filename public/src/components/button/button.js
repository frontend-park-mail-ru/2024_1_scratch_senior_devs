import '../../../build/button.js'

export class Button {
    #parent;
    #props = {
        id: "",
        text: "",
    };
    #onSubmit;

    constructor(parent, config, onSubmit) {
        this.id = crypto.randomUUID();
        this.#parent = parent;
        this.#props.id = this.id;
        this.#props.text = config.text;
        this.#onSubmit = onSubmit;
    }

    get self(){
        return document.getElementById(`submit-btn-${this.id}`);
    }

    #addEventListeners(){
        if (this.#onSubmit !== undefined) {
            this.self.addEventListener('click', (e) => {
                e.preventDefault()
                this.#onSubmit()
            });
        }
    }

    #removeEventListeners(){
        this.self.removeEventListener('click', this.#onSubmit);
    }

    remove(){
        if (this.#onSubmit !== undefined) {
            this.#removeEventListeners();
        }
    }

    render(){


        this.#parent.insertAdjacentHTML(
            'beforeend',
            Handlebars.templates['button.hbs'](this.#props)
        )


        this.#addEventListeners();
    }
}