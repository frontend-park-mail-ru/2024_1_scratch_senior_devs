import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";

export class LoginForm extends  ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <form className="login-form">
                <h3>Вход</h3>
                <Input type="text"></Input>
                <Input type="password"></Input>
                <Button label="Войти"></Button>
            </form>
        );
    }
}