import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {AppRouter} from "../../modules/router";
import "./logo.sass"

export class Logo extends ScReact.Component<any, any> {
    handleClick() {
        AppRouter.go("/")
    }

    render(): VDomNode {
        return (
            <div className="logo-wrapper" onclick={this.handleClick}>
                <img src="src/assets/logo.png" alt=""/>
            </div>
        );
    }
}