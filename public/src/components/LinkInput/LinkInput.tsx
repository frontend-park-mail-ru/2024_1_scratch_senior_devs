import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./LinkInput.sass"

export class LinkInput extends ScReact.Component<any, any> {

    private ref: HTMLElement

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (this.props.open && !this.ref.contains(e.target) && this.props.toggleBtn && !this.props.toggleBtn.contains(e.target)) {
            this.props.handleClose()
        }
    }

    render() {
        return (
            <div className={"link-input-container " + (this.props.open ? "open" : "")} ref={ref => {this.ref = ref}}>
                <input type="text" placeholder="Введите ссылку" className="link-input"/>
                <button type="submit" className="link-btn" onclick={this.props.handleClose}>
                    <Img src="daw.svg" className="success-icon"/>
                </button>
            </div>
        )
    }
}