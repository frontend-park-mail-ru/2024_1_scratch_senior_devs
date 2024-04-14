import {ScReact} from '@veglem/screact';
import './Loader.sass';

export class Loader extends ScReact.Component<any, any> {
    render() {
        return (
            <div className={'loader ' + (this.props.active ? 'active' : '')}>
                <div className="loader__circle">

                </div>
            </div>
        );
    }
}