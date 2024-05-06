import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {AppRouter} from '../../modules/router';
import './logo.sass';
import {Img} from '../Image/Image';
import {AppUserStore} from "../../modules/stores/UserStore";

export class Logo extends ScReact.Component<any, any> {
    handleClick() {
        if (AppUserStore.state.isAuth) {
            if (location.pathname != "/notes") {
                AppRouter.go('/notes');
            }

            return
        }

        AppRouter.go('/');
    }

    render(): VDomNode {
        return (
            <div className="logo-wrapper" onclick={this.handleClick}>
                <Img src="logo.svg" className="logo"/>
            </div>
        );
    }
}