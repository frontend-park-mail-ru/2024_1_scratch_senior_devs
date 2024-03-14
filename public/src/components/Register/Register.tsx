import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";

export class RegisterForm extends  ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <form className="register-form">
                <h3>Регистрация</h3>
                <Input type="text" placeholder="Придумайте логин"></Input>
                <Input type="password" placeholder="Придумайте пароль"></Input>
                <Input type="password" placeholder="Повторите пароль"></Input>
                <Button label="Войти"></Button>
            </form>
        );
    }
}