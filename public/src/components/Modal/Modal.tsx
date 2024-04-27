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
                <div key1={"overlay"} className="overlay" ref={ref => this.overlayRef = ref}></div>
                <div key1={"content"} className="modal-content">
                    {this.props.open ? this.props.content : ""}
                    <Img key1={"close"} src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                </div>
            </div>
        );
    }
}