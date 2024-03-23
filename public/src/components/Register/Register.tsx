import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin, ValidatePassword} from "../../modules/validation";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";

export class RegisterForm extends  ScReact.Component<any, any> {
    state = {
        login: "",
        errorLogin: "",
        loginValidationResult: false,

        password: "",
        errorPassword: "",
        passwordValidationResult: false,

        repeatPassword: "",
        errorRepeatPassword: "",
        repeatPasswordValidationResult: false
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        AppUserStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (store:UserStoreState) => {
        if (store.errorRegisterForm !== undefined) {
            this.setLoginError(store.errorRegisterForm)
            this.setLoginValidated(false)
        }
    }

    handleSubmit = () => {
        if (this.state.loginValidationResult && this.state.passwordValidationResult && this.state.repeatPasswordValidationResult) {
            AppDispatcher.dispatch(
                UserActions.REGISTER,
                {
                    username: this.state.login,
                    password: this.state.password
                }
            )
        }
    }

    setLoginValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            loginValidationResult: value
        }))
    }

    setLogin = (value:string) => {
        this.setState(state => ({
            ...state,
            login: value
        }))

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
        this.setState(state => ({
            ...state,
            password: value
        }))

        if (this.state.password != this.state.repeatPassword) {
            this.setRepeatPasswordError("Пароли не совпадают")
            this.setPasswordError("Пароли не совпадают")
            this.setPasswordValidated(false)
            this.setRepeatPasswordValidated(false)
            return
        }

        const {message, result} = ValidatePassword(value)

        if (!result) {
            this.setPasswordValidated(false)
            this.setPasswordError(message)
        } else {
            this.setPasswordValidated(true)
            this.setRepeatPasswordValidated(true)
            this.setPasswordError("")
            this.setRepeatPasswordError("")
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

    setRepeatPassword = (value:string) => {
        this.setState(state => ({
            ...state,
            repeatPassword: value
        }))

        if (this.state.password != this.state.repeatPassword) {
            this.setRepeatPasswordError("Пароли не совпадают")
            this.setPasswordError("Пароли не совпадают")
            this.setPasswordValidated(false)
            this.setRepeatPasswordValidated(false)
            return
        }

        const {message, result} = ValidatePassword(value)

        if (!result) {
            this.setRepeatPasswordValidated(false)
            this.setRepeatPasswordError(message)
        } else {
            this.setPasswordValidated(true)
            this.setRepeatPasswordValidated(true)
            this.setRepeatPasswordError("")
            this.setPasswordError("")
        }
    }

    setRepeatPasswordError = (value:string) => {
        this.setState(state => ({
            ...state,
            errorRepeatPassword: value
        }))
    }

    setRepeatPasswordValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            repeatPasswordValidationResult: value
        }))
    }

    render(): VDomNode {
        return (
            <form className="register-form">
                <h3>Регистрация</h3>
                <Input
                    type="text"
                    placeholder="Придумайте логин"
                    icon="/src/assets/user.png"
                    onChange={this.setLogin}
                    value={this.state.login}
                    error={this.state.errorLogin}
                    validationResult={this.state.loginValidationResult}
                />
                <Input
                    type="password"
                    placeholder="Придумайте пароль"
                    icon="src/assets/password.png"
                    value={this.state.password}
                    onChange={this.setPassword}
                    error={this.state.errorPassword}
                    validationResult={this.state.passwordValidationResult}
                />
                <Input
                    type="password"
                    placeholder="Повторите пароль"
                    icon="src/assets/password.png"
                    value={this.state.repeatPassword}
                    onChange={this.setRepeatPassword}
                    error={this.state.errorRepeatPassword}
                    validationResult={this.state.repeatPasswordValidationResult}
                />
                <span onclick={this.props.toggleForm}>Еще не зарегистрированы?</span>
                <Button label="Войти" onClick={this.handleSubmit}/>
            </form>
        );
    }
}