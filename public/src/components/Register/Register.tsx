import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin, ValidatePassword} from "../../modules/validation";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";
import {Link} from "../Link/Link";

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
        this.checkLogin()
        this.checkPassword()
        this.checkRepeatPassword()

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
        this.checkRepeatPassword()
    }

    checkPassword = () => {
        const {message, result} = ValidatePassword(this.state.password)

        if (!result) {
            this.setPasswordValidated(false)
            this.setPasswordError(message)
        } else if (this.state.password.length > 0 && this.state.password !== this.state.repeatPassword){
            this.setRepeatPasswordError("Пароли не совпадают")
            this.setPasswordError("Пароли не совпадают")
            this.setPasswordValidated(false)
            this.setRepeatPasswordValidated(false)
        } else {
            this.setPasswordValidated(true)
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

    setRepeatPassword = (value:string) => {
        this.setState(state => ({
            ...state,
            repeatPassword: value
        }))

        this.checkPassword()
        this.checkRepeatPassword()
    }

    checkRepeatPassword = () => {
        const {message, result} = ValidatePassword(this.state.repeatPassword)

        if (!result) {
            this.setRepeatPasswordValidated(false)
            this.setRepeatPasswordError(message)
        } else if (this.state.repeatPassword.length > 0 && this.state.password !== this.state.repeatPassword) {
            this.setRepeatPasswordError("Пароли не совпадают")
            this.setPasswordError("Пароли не совпадают")
            this.setPasswordValidated(false)
            this.setRepeatPasswordValidated(false)
        } else {
            this.setRepeatPasswordValidated(true)
            this.setRepeatPasswordError("")
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
                <Link label="Уже зарегистрированы?" onClick={this.props.toggleForm} />
                <Button label="Зарегистрироваться" onClick={this.handleSubmit}/>
            </form>
        );
    }
}