import '../../../build/button.js'
import {AppEventMaker} from "../../modules/eventMaker.js";
import {SubmitButtonEvents} from "./events.js";

export class Button {
    #parent;
    #props = {
        btnLabel: ''
    };
    id;

    #listeners = {
        submit: this.#submit.bind(this)
    };

    constructor(parent, {btnLabel}) {
        this.id = crypto.randomUUID();
        this.#parent = parent;
        this.#props.btnLabel = btnLabel;
        this.#props.id = this.id;
        // this.#listeners.submit = this.#submit.bind(this);
    }

    get self(){
        return document.getElementById(`submit-btn-${this.id}`);
    }

    #submit(event){
        event.preventDefault();
        AppEventMaker.notify(SubmitButtonEvents.BUTTON_SUBMIT, this.id);
    }

    #addEventListeners(){
        this.self.addEventListener('click', this.#listeners.submit);
    }

    #removeEventListeners(){
        this.self.removeEventListener('click', this.#listeners.submit);
    }

    remove(){
        this.#removeEventListeners();
    }

    render(){

        this.#parent.insertAdjacentHTML(
            'beforeend',
            Handlebars.templates['button.hbs'](this.#props)
        )

        this.#addEventListeners();
    }
}