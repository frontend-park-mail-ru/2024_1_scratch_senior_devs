import {ScReact} from '@veglem/screact';
import './Header.sass';
import {AppRouter} from '../../modules/router';
import {Logo} from '../Logo/logo';
import {Profile} from '../Profile/Profile';
import {AuthPage} from '../../pages/Auth';
import {AppUserStore, UserActions, UserStoreState} from '../../modules/stores/UserStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {AppNotesStore, NotesStoreState} from "../../modules/stores/NotesStore";
import {uiKit} from '@veglem/ui-kit/dist/ui';

export class Header extends ScReact.Component<any, any>{
    state = {
        isAuth: false,
        userChecked: false,
        avatarUrl: false,
        otpEnabled: false,
        qr: undefined,
        fullscreen: false
    };

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState);
        AppNotesStore.SubscribeToStore(this.checkFullscreen);
        AppDispatcher.dispatch(UserActions.CHECK_USER);
    }

    updateState = (store:UserStoreState) => {
        this.setState(state => ({
            ...state,
            isAuth: store.isAuth,
            avatarUrl: store.avatarUrl,
            userChecked: true,
            otpEnabled: store.otpEnabled,
            qr: store.qr
        }));
    };

    checkFullscreen = (store:NotesStoreState) => {
        this.setState(state => ({
            ...state,
            fullscreen: store.fullScreen
        }));
    };

    render() {
        const {Button} = uiKit

        return (
            <header id="header" className={(location.pathname.includes("notes") && this.state.isAuth ? "notes " : "") + (this.state.fullscreen ? "fullscreen" : "")}>
                <Logo />
                { this.state.userChecked ? (
                    this.state.isAuth ? <Profile avatarUrl={this.state.avatarUrl} otpEnabled={this.state.otpEnabled} qr={this.state.qr}/> : (
                        this.props.currPage !== AuthPage ? <Button label="Вход" onClick={() => AppRouter.go('/login')} /> : ''
                    )
                 ) : ''
                }
            </header>
        );
    }
}
