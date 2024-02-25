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

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
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
                    payload: "scsfsv"})
            }
        })
    }

    #unsubscribeToEvents(){
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, (id) => {
            if(id === this.#passwordInput.id){
                this.#validatePassword()
            } else{
                this.#validateLogin();
            }
        });
        AppEventMaker.unsubscribe(SubmitButtonEvents.BUTTON_SUBMIT, (id) => {
            if(id === this.#submitBtn.id){
                AppDispatcher.dispatch({
                    type: UserActions.LOGIN,
                    payload: "scsfsv"})
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
    }

    render() {
        this.#parent.innerHTML = '';
        this.#parent.insertAdjacentHTML('beforeend', window.Handlebars.templates['login.hbs'](this.#config.login));
        this.#loginInput = new Input(document.querySelector('.username-input-place'),
            {
                type: 'text',
                placeholder: 'Введите логин'
            });
        this.#loginInput.render();

        this.#passwordInput = new Input(document.querySelector('.password-input-place'),
            {
                type: 'password',
                placeholder: 'Введите пароль'
            });
        this.#passwordInput.render();

        this.#submitBtn = new SubmitButton(document.querySelector('.submit-btn-place'),
            {
                btnLabel: "Войти"
            });
        this.#submitBtn.render();
        this.#subscribeToEvents();
    }
}
