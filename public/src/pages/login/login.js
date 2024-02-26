import "../../../build/login.js"
import {Input} from "../../components/input/input.js";
import {Button} from "../../components/button/button.js";
import {inputEvents} from "../../components/input/events.js";
import {SubmitButtonEvents} from "../../components/button/events.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {AppDispatcher} from "../../modules/dispathcer.js";
import {UserActions} from "../../stores/user/userStore.js";
import {Link} from "../../components/link/link.js";

export default class LoginPage {
    #parent;
    #config;

    #loginInput;
    #passwordInput;
    #link;
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

    get form () {
        return document.getElementById(this.#config.form.id)
    }

    #subscribeToEvents(){
        console.log("subscribeToEvents")

        AppEventMaker.subscribe(inputEvents.INPUT_CHANGE, (id) => {
            if(id === this.#passwordInput.id){
                this.#validatePassword()
            } else{
                this.#validateLogin();
            }
        });

        AppEventMaker.subscribe(SubmitButtonEvents.BUTTON_SUBMIT, (id) => {
            if(id === this.#submitBtn.id){
                const validateLogin = this.#validateLogin()
                const validatePassword = this.#validatePassword()
                if (validateLogin && validatePassword) {

                    AppDispatcher.dispatch({
                        type: UserActions.LOGIN,
                        payload: this.#loginInput.value
                    })
                }
            }
        })

        this.#subscribed = true; // Костыль
    }

    #unsubscribeToEvents(){
        console.log("unsubscribeToEvents")

        // TODO
        // Не работает

        /*
        AppEventMaker.unsubscribe(inputEvents.INPUT_CHANGE, (id) => {
            if(id === this.#passwordInput.id){
                this.#validatePassword()
            } else{
                this.#validateLogin();
            }
        });
        */

        AppEventMaker.unsubscribe(SubmitButtonEvents.BUTTON_SUBMIT, (id) => {
            if(id === this.#submitBtn.id){
                AppDispatcher.dispatch({
                    type: UserActions.LOGIN
                })
            }
        })
    }

    #validatePassword(){
        console.log("password validation started")

        const value = this.#passwordInput.value

        if (value === "")
        {
            this.#passwordInput.throwError("Пароль не может быть пустым!")
            return false
        }

        return true
    }

    #validateLogin(){
        console.log("login validation started")

        console.log(this.#loginInput)
        delete this.#loginInput.self.dataset.error

        const value = this.#loginInput.value

        if (value === "")
        {
            this.#loginInput.throwError("Логин не может быть пустым!")
            return false
        }



        return true
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

        this.#parent.insertAdjacentHTML(
            'beforeend',
            window.Handlebars.templates['login.hbs'](this.#config.form)
        );

        this.#loginInput = new Input(this.form, this.#config.form.inputs.login);
        this.#loginInput.render();

        this.#passwordInput = new Input(this.form, this.#config.form.inputs.password);
        this.#passwordInput.render();

        this.#link = new Link(this.form, this.#config.form.links.registerPage);
        this.#link.render();

        this.#submitBtn = new Button(this.form, this.#config.form.buttons.submitBtn);
        this.#submitBtn.render();

        // Костыль
        if (!this.#subscribed) {
            this.#subscribeToEvents();
        }
    }
}
