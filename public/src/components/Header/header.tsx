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
        isAuth: false,
        avatarUrl: ""
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
    }

    updateState = (store) => {
        this.setState(state => ({
            ...state,
            isAuth: store.isAuth,
            avatarUrl: store.avatarUrl
        }))
    }

    render() {
        return (
            <header id="header">
                <Logo />
                { this.state.isAuth ? <Profile avatarUrl={this.state.avatarUrl}/> : (this.props.currPage !== AuthPage ? <Button label="Вход" onClick={() => AppRouter.go("/login")} /> : "") }
            </header>
        )
    }
}
