import {ScReact} from "@veglem/screact";
import "./header.sass"
import {Button} from "../Button/Button";
import {AppRouter} from "../../modules/router";
import {Logo} from "../Logo/logo";
import {Profile} from "../Profile/Profile";
import {AuthPage} from "../../pages/Auth";
import {AppUserStore} from "../../modules/stores/UserStore";

export class Header extends ScReact.Component<any, any>{
    state = {
        isAuth: false
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
    }

    updateState = (storeState) => {
        this.setState(state => ({
            ...state,
            isAuth: storeState.isAuth
        }))
    }

    render() {
        return (
            <header id="header">
                <Logo />
                { this.state.isAuth ? <Profile /> : (this.props.currPage !== AuthPage ? <Button label="Вход" onClick={() => AppRouter.go("/login")} /> : "") }
            </header>
        )
    }
}
