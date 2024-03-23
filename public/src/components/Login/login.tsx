import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin, ValidatePassword} from "../../modules/validation";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";

export class LoginForm extends  ScReact.Component<any, any> {
    state = {
        errorLogin: "",
        loginValidationResult: false,
        login: "",

        errorPassword: "",
        passwordValidationResult: false,
        password: ""
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        AppUserStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (store:UserStoreState) => {
        if (store.errorLoginForm !== undefined) {
            this.setLoginError(store.errorLoginForm)
            this.setLoginValidated(false)
            this.setPasswordError(store.errorLoginForm)
            this.setPasswordValidated(false)
        }
    }

    handleSubmit = () => {
        this.checkLogin()
        this.checkPassword()

        if (this.state.loginValidationResult && this.state.passwordValidationResult) {
            AppDispatcher.dispatch(
                UserActions.LOGIN,
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
        this.setState(s => {
            return {
                ...s,
                login: value
            }
        })

        this.checkLogin()
    }

    checkLogin = () => {
        const {message, result} = ValidateLogin(this.state.login)
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

        this.checkPassword()
    }

    checkPassword = () => {
        const {message, result} = ValidatePassword(this.state.password)

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
                    value={this.state.login}
                    error={this.state.errorLogin}
                    validationResult={this.state.loginValidationResult}
                    onChange={this.setLogin}
                />
                <Input
                    type="password"
                    placeholder="Введите пароль"
                    icon="src/assets/password.png"
                    value={this.state.password}
                    error={this.state.errorPassword}
                    validationResult={this.state.passwordValidationResult}
                    onChange={this.setPassword}
                />
                <span onclick={this.props.toggleForm}>Еще не зарегистрированы?</span>
                <Button label="Войти" onClick={this.handleSubmit}/>
            </form>
        );
    }
}