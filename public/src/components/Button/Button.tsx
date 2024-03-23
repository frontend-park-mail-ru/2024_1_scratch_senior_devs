import {ScReact} from "@veglem/screact";
import "./Button.sass"

export class Button extends ScReact.Component<any, any>{

    handleClick = (e) => {
        e.preventDefault()
        this.props.onClick && this.props.onClick(e);
    }

    render() {
        return (
            <button className={"button " + this.props.className} onclick={this.handleClick}>
                {this.props.label}
            </button>
        )
    }
}
