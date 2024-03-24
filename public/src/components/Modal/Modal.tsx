import {ScReact} from "@veglem/screact";
import "./Modal.sass"
import {Img} from "../Image/Image";

export class Modal extends ScReact.Component<any, any> {
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (e.target.classList.contains("overlay")) {
            this.props.handleClose()
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    render() {
        return (
            <div className={"modal-wrapper " + (this.props.open ? "active" : "")}>
                <div className="overlay"></div>
                <div className="modal-content">
                    {/*{ScReact.createComponent(this.props.content, {open: this.props.open, key: "asdfasdfadsfa"})}*/}
                    {this.props.content}
                    <Img src="/src/assets/close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                </div>
            </div>
        )
    }
}