import {ScReact} from "@veglem/screact";
import "./Button.sass"

export class Button extends ScReact.Component<any, any>{
    render() {
        return (
            <button className="button" onclick={() => {
                this.props.onclick && this.props.onclick();
            }}>
                {this.props.label}
            </button>
        )
    }
}
