import {ScReact} from "@veglem/screact"
import {Router} from "./modules/router";
import "./utils/reset.sass"
import "./utils/fonts.sass"
import "./style.sass"
import {Header} from "./components/Header/header";

export class App extends ScReact.Component<any, any> {

    render() {
        return(
            <div>
                <Header />
                <Router></Router>
            </div>
        )
    }
}