import {ScReact} from '@veglem/screact';
import './Modal.sass';
import {Img} from "../Image/Image";

export class Modal extends ScReact.Component<any, any> {
    private overlayRef;

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.overlayRef.contains(e.target)) {
            this.props.handleClose();
        }
    };

    render() {
        return (
            <div className={'modal-wrapper ' + (this.props.open ? 'active' : '')}>
                <div className="overlay" ref={ref => this.overlayRef = ref}></div>
                <div className="modal-content">
                    <h2 className="modal-content__title">{this.props.title ? this.props.title : ""}</h2>
                    {(this.props.reset ? this.props.open : true) ? this.props.content : ""}
                    <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                </div>
            </div>
        );
    }
}