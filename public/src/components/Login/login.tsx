import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";

export class LoginForm extends  ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <form className="login-form">
                <Input types="text"></Input>
                <Input types="password"></Input>
                <Button label="Войти"></Button>
            </form>
        );
    }
}