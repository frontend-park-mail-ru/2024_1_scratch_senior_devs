import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Button} from "../../components/Button/Button";
import "./style.sass"

export class AuthPage extends ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <div className="auth-page-wrapper">
                <div className="glassmorphism-container">
                    <div className="auth-container">
                        <div className="form-container sign-in">

                        </div>
                        <div className="form-container sign-up">

                        </div>
                        <div className="toggle-container">
                            <div className="toggle">
                                <div className="toggle-panel toggle-left">
                                    <h2>Уже есть аккаунт?</h2>
                                    <Button title="Войти"></Button>
                                </div>
                                <div className="toggle-panel toggle-right">
                                    <h2>Ещё нет аккаунта?</h2>
                                    <Button title="Зарегистрироваться"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}