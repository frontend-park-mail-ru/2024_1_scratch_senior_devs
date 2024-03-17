import {ScReact} from "@veglem/screact";
import "./header.sass"
import {Button} from "../Button/Button";
import {AppRouter} from "../../modules/router";
import {Logo} from "../Logo/logo";
import {Profile} from "../Profile/Profile";
import {AuthPage} from "../../pages/Auth";

export class Header extends ScReact.Component<any, any>{
    render() {
        return (
            <header id="header">
                <Logo />
                { this.props.currPage !== AuthPage ? <Button label="Вход" onclick={() => AppRouter.go("/login")} /> : <Profile /> }
            </header>
        )
    }
}
