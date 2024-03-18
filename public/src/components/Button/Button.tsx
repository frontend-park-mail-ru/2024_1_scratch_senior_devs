import {ScReact} from "@veglem/screact";
import "./Button.sass"

export class Button extends ScReact.Component<any, any>{
    render() {
        return (
            <button className={"button " + this.props.className} onclick={(e) => {
                e.preventDefault()
                this.props.onClick && this.props.onClick(e);
            }}>
                {this.props.label}
            </button>
        )
    }
}
