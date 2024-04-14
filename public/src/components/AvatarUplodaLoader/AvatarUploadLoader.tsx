import {ScReact} from '@veglem/screact';
import './AvatarUploadLoader.sass';

export class AvatarUploadLoader extends ScReact.Component<any, any> {
    render() {
        return (
            <div className={'progress-bar ' + (this.props.active ? 'active' : '')}>
                <div className="progress-bar__inner"></div>
                <div className="progress-bar__checkmark">
                    <span></span>
                    <span></span>
                </div>
                <div className="progress-bar__circle">
                    <div className="progress-bar__container progress-bar__container-left">
                        <div className="progress-bar__progress"></div>
                    </div>
                    <div className="progress-bar__container progress-bar__container-right">
                        <div className="progress-bar__progress"></div>
                    </div>
                </div>
            </div>
        );
    }
}