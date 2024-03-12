import {ScReact} from "@veglem/screact";

export class Button extends ScReact.Component<any, any>{
    state = {
        clickHandler: () => {},
        btnName: "Click me",
        dis: false
    }
    render() {
        return (
            <button disabled={this.state.dis} onclick={(e) => {
                e.preventDefault();
                this.setState((s) => ({...s, btnName: "Clicked!", dis: true}));
                setTimeout(() => {
                    this.setState((s) => ({...s, btnName: "Click me", dis: false}));
                }, 1000);

                this.props.clickHandler();
            }
            }>{this.state.btnName}</button>
        )
    }
}
