import {ScReact} from "@veglem/screact"
import {Router} from "./modules/router";

export class App extends ScReact.Component<any, any> {

    render() {
        return(
            <Router></Router>
            )
    }
}