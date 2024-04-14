import {ScReact} from '@veglem/screact';
import {Img} from '../Image/Image';
import './Toast.sass';
import {TOAST_TYPE} from '../../modules/toasts';

export type ToastProps = {
    type: string,
    message: string,
    key1: string,
    offset: number,
    open: boolean,
    onHide: (id:string) => void
}

export class Toast extends ScReact.Component<ToastProps, any> {
    closeToast = () => {
        this.props.onHide(this.props.key1);
    };

    formatType ():string {
        if (this.props.type == TOAST_TYPE.SUCCESS) {
            return 'Успех';
        } else if (this.props.type == TOAST_TYPE.ERROR) {
            return 'Ошибка';
        }

        return 'Инфо';
    }

    render() {
        return (
            <div className={'toast success ' + (this.props.open ? '' : 'hide')} style={`bottom: ${this.props.offset}px`}>
                <div className="toast__content">
                    <Img src={this.props.type + '.svg'} className="toast-icon"/>
                    <div className="content">
                        <span className="content__title">{this.formatType()}</span>
                        <span className="content__message">{this.props.message}</span>
                    </div>
                </div>
                <Img src="close.svg" className="toast__close-btn" onClick={this.closeToast}/>
                <div className="toast__progress-bar"></div>
            </div>
        );
    }
}