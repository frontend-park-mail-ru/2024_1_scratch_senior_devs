import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';

export class ErrorPage extends ScReact.Component<{err: any}, any> {
    props = {
        err: 'Error'
    };

    render(): VDomNode {
        return (
            <h1>{this.props.err}</h1>
        );
    }
}