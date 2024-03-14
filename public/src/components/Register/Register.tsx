import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin, ValidatePassword} from "../../modules/validation";

export class RegisterForm extends  ScReact.Component<any, any> {
    state = {
        loginValidated: false,
        password: "",
        repeatPassword: ""
    }

    setLoginValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            loginValidated: value
        }))
    }

    handlePasswordChange = (value:string) => {
        console.log("handlePasswordChange")
        console.log(value)
    }

    handleRepeatPasswordChange = (value:string) => {

    }

    render(): VDomNode {
        return (
            <form className="register-form">
                <h3>Регистрация</h3>
                <Input type="text" placeholder="Придумайте логин" icon="/src/assets/user.png" validation={ValidateLogin} setSuccess={this.setLoginValidated} />
                <Input type="password" placeholder="Придумайте пароль" icon="src/assets/password.png" onChange={this.handlePasswordChange}/>
                <Input type="password" placeholder="Повторите пароль" icon="src/assets/password.png" />
                <Button label="Войти"></Button>
            </form>
        );
    }
}