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

    render(): VDomNode {
        return (
            <form className="login-form">
                <h3>Вход</h3>
                <Input type="text" placeholder="Введите логин" icon="src/assets/user.png" validation={ValidateLogin}/>
                <Input type="password" placeholder="Введите пароль" icon="src/assets/password.png" validation={ValidatePassword}/>
                <Button label="Войти" />
            </form>
        );
    }
}