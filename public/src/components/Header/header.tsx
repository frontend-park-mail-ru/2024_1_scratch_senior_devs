import {ScReact} from "@veglem/screact";
import "./header.sass"
import {Button} from "../Button/Button";
import {AppRouter} from "../../modules/router";
import {Logo} from "../Logo/logo";

export class Header extends ScReact.Component<any, any>{
    render() {
        return (
            <header id="header">
                <Logo />
                <Button label="Вход" onclick={() => AppRouter.go("/auth")}></Button>
            </header>
        )
    }
}
