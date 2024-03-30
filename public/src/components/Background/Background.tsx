import {ScReact} from "@veglem/screact";
import "./Background.sass"

export class Background extends ScReact.Component<any, any> {
    render() {
        if (this.props.currPage.name === "NotesPage") {
            return (
                <div>
                </div>
            )
        }

        return (
            <div className="background">
                <div className="parallax-bg"></div>
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
            </div>
        )
    }
}