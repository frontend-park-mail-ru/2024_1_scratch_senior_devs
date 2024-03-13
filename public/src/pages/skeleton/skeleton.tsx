import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";

export class Skeleton extends ScReact.Component<any, any> {

    render(): VDomNode {
        return (
            <div>
                <h1>
                    Skeleton page
                </h1>
            </div>
        );
    }
}