import {ScReact} from "@veglem/screact";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {Img} from "../Image/Image";
import "./UpdatePassword.sass"
import {ValidatePassword} from "../../modules/validation";
import {AppDispatcher} from "../../modules/dispatcher";
import {UserActions} from "../../modules/stores/UserStore";

export class UpdatePasswordForm extends ScReact.Component<any, any> {
    state = {
        password: "",
        errorPassword: "",
        passwordValidationResult: false,

        repeatPassword: "",
        errorRepeatPassword: "",
        repeatPasswordValidationResult: false,
    }

    componentDidUpdate() {
        console.log("componentDidUpdate")
        console.log(this.props) // Пусто

        // TODO
        // if (this.props.open === false) {
        //     setTimeout(() => {
        //         this.setState(() => ({
        //             password: "",
        //             errorPassword: "",
        //             passwordValidationResult: false,
        //
        //             repeatPassword: "",
        //             errorRepeatPassword: "",
        //             repeatPasswordValidationResult: false
        //         }))
        //     }, 500)
        // }
    }

    closeModal = () => {
        AppDispatcher.dispatch(UserActions.CLOSE_CHANGE_PASSWORD_FORM)

        setTimeout(() => {
            this.setState(() => ({
                password: "",
                errorPassword: "",
                passwordValidationResult: false,

                repeatPassword: "",
                errorRepeatPassword: "",
                repeatPasswordValidationResult: false
            }))
        }, 500)
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
            <div className="change-password-form">
                <h2>Форма изменения пароля</h2>
                <Input
                    type="password"
                    placeholder="Старый пароль"
                    icon="src/assets/password.png"
                    value={this.state.password}
                    onChange={this.setPassword}
                    error={this.state.errorPassword}
                    validationResult={this.state.passwordValidationResult}
                />
                <Input
                    type="password"
                    placeholder="Новый пароль"
                    icon="src/assets/password.png"
                    value={this.state.repeatPassword}
                    onChange={this.setRepeatPassword}
                    error={this.state.errorRepeatPassword}
                    validationResult={this.state.repeatPasswordValidationResult}
                />
                <Button label="Изменить" onClick={this.handleSubmit}/>
            </div>
        )
    }
}