import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {AppRouter} from '../../modules/router';
import './logo.sass';
import {Img} from '../Image/Image';

export class Logo extends ScReact.Component<any, any> {
    handleClick() {
        AppRouter.go('/');
    }

    render(): VDomNode {
        return (
            <div className="logo" onclick={this.handleClick}>
                <Img src="logo.svg" className="logo__image"/>
            </div>
        );
    }
}