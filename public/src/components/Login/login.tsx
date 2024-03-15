import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin, ValidatePassword} from "../../modules/validation";

export class LoginForm extends  ScReact.Component<any, any> {
    state = {
        errorLogin: "",
        loginValidationResult: false,

        errorPassword: "",
        passwordValidationResult: false
    }

    handleSubmit = (e) => {
        e.preventDefault()

        if (this.state.loginValidationResult && this.state.passwordValidationResult) {

            // TODO

        }
    }

    setLoginValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            loginValidationResult: value
        }))
    }

    setLogin = (value:string) => {
        const {message, result} = ValidateLogin(value)
        this.setLoginValidated(result)

        if (!result) {
            this.setLoginError(message)
        } else {
            this.setLoginError("")
        }
    }

    setLoginError = (value:string) => {
        this.setState(state => ({
            ...state,
            errorLogin: value
        }))
    }

    setPassword = (value:string) => {
        const {message, result} = ValidatePassword(value)
        this.setPasswordValidated(result)

        if (!result) {
            this.setPasswordError(message)
        } else {
            this.setPasswordError("")
        }
    }

    setPasswordError = (value:string) => {
        this.setState(state => ({
            ...state,
            errorPassword: value
        }))
    }

    setPasswordValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            passwordValidationResult: value
        }))
    }

    render(): VDomNode {
        return (
            <form className="login-form">
                <h3>Вход</h3>
                <Input
                    type="text"
                    placeholder="Введите логин"
                    icon="src/assets/user.png"
                    error={this.state.errorLogin}
                    validationResult={this.state.loginValidationResult}
                    onChange={this.setLogin}
                />
                <Input
                    type="password"
                    placeholder="Введите пароль"
                    icon="src/assets/password.png"
                    error={this.state.errorPassword}
                    validationResult={this.state.passwordValidationResult}
                    onChange={this.setPassword}
                />
                <Button label="Войти" onclick={this.handleSubmit}/>
            </form>
        );
    }
}