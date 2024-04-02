import {ScReact} from "@veglem/screact";
import "./Modal.sass"
import {Img} from "../Image/Image";

export class Modal extends ScReact.Component<any, any> {
    state ={
        overlayRef: null
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (this.state.overlayRef.contains(e.target)) {
            this.props.handleClose()
        }
    }

    render() {
        return (
            <div className={"modal-wrapper " + (this.props.open ? "active" : "")}>
                <div className="overlay" ref={ref => {this.state.overlayRef = ref}}></div>
                <div className="modal-content">
                    {/*{ScReact.createComponent(this.props.content, {open: this.props.open, key: "asdfasdfadsfa"})}*/}
                    {this.props.content}
                    <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                </div>
            </div>
        )
    }
}