import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin, ValidatePassword} from "../../modules/validation";

export class LoginForm extends  ScReact.Component<any, any> {
    state = {
        loginValidated: false,
        passwordValidated: false
    }

    handleSubmit(e) {
        e.preventDefault()
        console.log("handleSubmit")

        if (this.state.loginValidated && this.state.passwordValidated) {

            // TODO

        }
    }

    setLoginValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            loginValidated: value
        }))
    }

    setPasswordValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            passwordValidated: value
        }))
    }

    render(): VDomNode {
        return (
            <form className="login-form">
                <h3>Вход</h3>
                <Input type="text" placeholder="Введите логин" icon="src/assets/user.png" validation={ValidateLogin} setSuccess={this.setLoginValidated}/>
                <Input type="password" placeholder="Введите пароль" icon="src/assets/password.png" validation={ValidatePassword} setSuccess={this.setPasswordValidated}/>
                <Button label="Войти" onclick={(e) => this.handleSubmit(e)}/>
            </form>
        );
    }
}