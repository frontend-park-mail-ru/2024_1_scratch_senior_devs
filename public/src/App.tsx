import {ScReact} from "@veglem/screact"
import {Router} from "./modules/router";
import "./utils/reset.sass"
import "./utils/fonts.sass"

export class App extends ScReact.Component<any, any> {

    render() {
        return(
            <Router></Router>
        )
    }
}