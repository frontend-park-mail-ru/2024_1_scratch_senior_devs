import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {ValidateLogin} from "../../modules/validation";

export class RegisterForm extends  ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <form className="register-form">
                <h3>Регистрация</h3>
                <Input type="text" placeholder="Придумайте логин" icon="/src/assets/user.png" validation={ValidateLogin} />
                <Input type="password" placeholder="Придумайте пароль" icon="src/assets/password.png" />
                <Input type="password" placeholder="Повторите пароль" icon="src/assets/password.png" />
                <Button label="Войти"></Button>
            </form>
        );
    }
}