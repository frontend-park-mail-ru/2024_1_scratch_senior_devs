import {ScReact} from "@veglem/screact";
import "./Button.sass"

export class Button extends ScReact.Component<any, any>{
    render() {
        return (
            <button className="button" onclick={(e) => {
                this.props.onClick && this.props.onClick(e);
            }}>
                {this.props.label}
            </button>
        )
    }
}
