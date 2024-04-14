import {ScReact} from '@veglem/screact';
import './QRModal.sass';

export class QRModal extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="qr">
                <h3 className="qr__title">Ваш QR-код</h3>
                <img src={this.props.image} className="qr__img" alt=""/>
            </div>
        );
    }
}