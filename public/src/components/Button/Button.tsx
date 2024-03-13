import {ScReact} from "@veglem/screact";
import "./Button.sass"

export class Button extends ScReact.Component<any, any>{
    state = {
        onclick: () => {},
        btnName: "Click me",
        dis: false
    }
    render() {
        return (
            <button className="button" disabled={this.state.dis} onclick={(e) => {
                e.preventDefault();
                this.props.onclick();
            }
            }>{this.props.title}</button>
        )
    }
}
