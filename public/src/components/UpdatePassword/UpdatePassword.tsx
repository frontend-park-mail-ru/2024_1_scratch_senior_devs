import {ScReact} from "@veglem/screact";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {Img} from "../Image/Image";
import "./UpdatePassword.sass"
import {ValidatePassword} from "../../modules/validation";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";
import {AppToasts} from "../Toasts/Toasts";

export class UpdatePasswordForm extends ScReact.Component<any, any> {
    state = {
        password: "",
        errorPassword: "",
        passwordValidationResult: false,

        repeatPassword: "",
        errorRepeatPassword: "",
        repeatPasswordValidationResult: false
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
        document.addEventListener('click', this.handleClickOutside, true)
    }

    componentWillUnmount() {
        AppUserStore.UnSubscribeToStore(this.updateState)
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (e.target.classList.contains("overlay")) {
            this.closeModal()
        }
    }

    updateState = (store:UserStoreState) => {
        if (store.errorUpdatePasswordForm == "Неправильный пароль") {
            this.setPasswordError("Неправильный пароль")
            this.setPasswordValidated(false)
        } else {
            this.closeModal()
            AppToasts.success("Пароль успешно изменен")
        }
    }

    closeModal = () => {
        // TODO
        // this.state.timer = setTimeout(() => {
        //     this.setState(() => ({
        //         password: "",
        //         errorPassword: "",
        //         passwordValidationResult: false,
        //
        //         repeatPassword: "",
        //         errorRepeatPassword: "",
        //         repeatPasswordValidationResult: false
        //     }))
        // }, 500)

        this.props.closeModal()
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
        if (this.state.password.length > 0 && this.state.password == this.state.repeatPassword) {
            this.setRepeatPasswordError("Пароли совпадают")
            this.setPasswordError("Пароли совпадают")
            this.setPasswordValidated(false)
            this.setRepeatPasswordValidated(false)
            return
        }

        const {message, result} = ValidatePassword(this.state.password)

        if (!result) {
            this.setPasswordValidated(false)
            this.setPasswordError(message)
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
        if (this.state.repeatPassword.length > 0 && this.state.password == this.state.repeatPassword) {
            this.setRepeatPasswordError("Пароли совпадают")
            this.setPasswordError("Пароли совпадают")
            this.setPasswordValidated(false)
            this.setRepeatPasswordValidated(false)
            return
        }

        const {message, result} = ValidatePassword(this.state.repeatPassword)

        if (!result) {
            this.setRepeatPasswordValidated(false)
            this.setRepeatPasswordError(message)
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

    handleSubmit = () => {
        this.checkPassword()
        this.checkRepeatPassword()

        if (this.state.passwordValidationResult && this.state.repeatPasswordValidationResult) {
           AppDispatcher.dispatch(UserActions.UPDATE_PASSWORD, {
               oldPassword: this.state.password,
               newPassword: this.state.repeatPassword
           })
        }
    }

    render() {
        return (
            <div className={"modal-wrapper " + (this.props.open ? "active" : "")}>
                <div className="overlay"></div>
                <div className="modal-content change-password-form">
                    <h2>Форма изменения пароля</h2>
                    <Input
                        placeholder="Старый пароль"
                        icon="src/assets/password.png"
                        value={this.state.password}
                        onChange={this.setPassword}
                        error={this.state.errorPassword}
                        validationResult={this.state.passwordValidationResult}
                    />
                    <Input
                        placeholder="Новый пароль"
                        icon="src/assets/password.png"
                        value={this.state.repeatPassword}
                        onChange={this.setRepeatPassword}
                        error={this.state.errorRepeatPassword}
                        validationResult={this.state.repeatPasswordValidationResult}
                    />
                    <Button label="Изменить" onClick={this.handleSubmit}/>
                    <Img src="/src/assets/close.svg" className="close-modal-btn" onClick={this.closeModal}/>
                </div>
            </div>
        )
    }
}