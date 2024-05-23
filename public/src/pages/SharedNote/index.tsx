import {ScReact} from "@veglem/screact";
import "./style.sass"
import "../../components/Editor/Editor.sass"
import {ViewerWrapper} from "../../components/ViewerWrapper/ViewerWrapper";

export class SharedNotePage extends ScReact.Component<any, any> {
    state = {
        fullScreen: false
    }

    openFullScreen = () => {
        this.setState(state => ({
            ...state,
            fullScreen: true
        }))
    }

    closeFullScreen = () => {
        this.setState(state => ({
            ...state,
            fullScreen: false
        }))
    }

    render () {
        return (
            <div className={"shared-note-page " + (this.state.fullScreen ? "fullscreen" : "")}>
                <ViewerWrapper note={this.props.note} fullScreen={this.state.fullScreen} openFullScreen={this.openFullScreen} closeFullScreen={this.closeFullScreen}/>
            </div>
        )
    }
}