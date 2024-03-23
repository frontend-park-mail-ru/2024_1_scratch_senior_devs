import {ScReact} from "@veglem/screact";
import "./Link.sass"

export class Link extends  ScReact.Component<any, any> {

    handleClick = (e) => {
        e.preventDefault()
        this.props.onClick && this.props.onClick(e);
    }

    render() {
        return (
            <span className="link" onclick={this.handleClick}>{this.props.label}</span>
        )
    }
}