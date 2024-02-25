import "../../../build/login.js"
import {Input} from "../../components/input/input.js";
import {SubmitButton} from "../../components/submit-button/submitButton.js";
import {inputEvents} from "../../components/input/events.js";
import {SubmitButtonEvents} from "../../components/submit-button/events.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {AppUserStore, UserActions} from "../../stores/user/userStore.js";

export default class LoginPage {
    #parent;
    #config;

    #loginInput;
    #passwordInput;
    #submitBtn;

    #subscribed; // Костыль

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
        this.#subscribed = false; // Костыль
    }

    get href () {
        return this.#config.href;
    }

    #subscribeToEvents(){
        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, (id) => {
            if(id === this.#passwordInput.id){
                this.#validatePassword()
            } else{
                this.#validateLogin();
            }
        });

        AppEventMaker.subscribe(SubmitButtonEvents.BUTTON_SUBMIT, (id) => {
            if(id === this.#submitBtn.id){
                AppDispatcher.dispatch({
                    type: UserActions.LOGIN,
                    payload: this.#loginInput.value
                })
            }
        })

        this.#subscribed = true; // Костыль
    }

    #unsubscribeToEvents(){
        console.log("unsubscribeToEvents")

        // TODO
        // Не работает

        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, (id) => {
            if(id === this.#passwordInput.id){
                this.#validatePassword()
            } else{
                this.#validateLogin();
            }
        });

        AppEventMaker.unsubscribe(SubmitButtonEvents.BUTTON_SUBMIT, (id) => {
            console.log("fasfdfasd")
            if(id === this.#submitBtn.id){
                console.log("fffff")
                AppDispatcher.dispatch({
                    type: UserActions.LOGIN
                })
            }
        })

    }

    #validatePassword(){
        console.log("password validated")
    }

    #validateLogin(){
        console.log("login validated")
    }

    remove(){
        this.#unsubscribeToEvents();
        this.#submitBtn.remove();
        this.#passwordInput.remove();
        this.#loginInput.remove();
        this.#parent.innerHTML = '';
    }

    render() {
        console.log("loginPage render")

        this.#parent.insertAdjacentHTML('beforeend', window.Handlebars.templates['login.hbs'](this.#config.loginPage));
        this.#loginInput = new Input(document.querySelector('.username-input-place'), this.#config.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(document.querySelector('.password-input-place'), this.#config.inputs.password);
        this.#passwordInput.render();

        this.#submitBtn = new SubmitButton(document.querySelector('.submit-btn-place'), this.#config.buttons.submitBtn);
        this.#submitBtn.render();

        // Костыль
        if (!this.#subscribed) {
            this.#subscribeToEvents();
        }

    }
}
