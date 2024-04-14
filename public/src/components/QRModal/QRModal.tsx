import {ScReact} from '@veglem/screact';
import './QRModal.sass';

export class QRModal extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="qr-container">
                <h3>Ваш QR-код</h3>
                <img src={this.props.image} alt=""/>
            </div>
        );
    }
}