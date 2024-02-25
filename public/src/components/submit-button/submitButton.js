import '../../../build/submitButton.js'
import {AppEventMaker} from "../../modules/eventMaker.js";
import {SubmitButtonEvents} from "./events.js";

export class SubmitButton{
    #parent;
    #props = {
        btnLabel: ''
    };
    id;

    #listeners = {
        submit: this.#submit.bind(this)
    };

    constructor(parent, {btnLabel}) {
        this.#parent = parent;
        this.#props.btnLabel = btnLabel;
        this.id = crypto.randomUUID();
        // this.#listeners.submit = this.#submit.bind(this);
    }

    get self(){
        return document.querySelector(`#submit-btn-${this.id}`);
    }

    #submit(event){
        event.preventDefault();
        AppEventMaker.notify(SubmitButtonEvents.BUTTON_SUBMIT, this.id);
    }

    #addEventListeners(){
        self.addEventListener('click', this.#listeners.submit);
    }

    #removeEventListeners(){
        self.removeEventListener('click', this.#listeners.submit);
    }

    render(){
        this.#parent.insertAdjacentHTML(
            'beforeend',
            Handlebars.templates['submitButton.hbs'](this.#props)
        )

        this.#addEventListeners();
    }
}