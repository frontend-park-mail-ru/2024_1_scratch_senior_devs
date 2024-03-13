import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {AppRouter} from "../../modules/router";

export class MainPage extends ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <div>
                <h2>MainPage</h2>
                <button onclick={() => {
                    AppRouter.go('4000004');
                }}>Click</button>
                <div></div>
            </div>
        );
    }
}