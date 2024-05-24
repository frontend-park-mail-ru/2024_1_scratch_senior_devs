import {ScReact} from "@veglem/screact";
import "./style.sass"
import "../../components/Editor/Editor.sass"
import {ViewerWrapper} from "../../components/ViewerWrapper/ViewerWrapper";
import {AppNotesStore} from "../../modules/stores/NotesStore";
import {NoteStoreActions} from "../../modules/stores/NoteStore";

export class SharedNotePage extends ScReact.Component<any, any> {
    state = {
        fullScreen: false
    }

    openFullScreen = () => {
        this.setState(state => ({
            ...state,
            fullScreen: true
        }))
        document.getElementById("header").classList.add("fullscreen")
    }

    closeFullScreen = () => {
        this.setState(state => ({
            ...state,
            fullScreen: false
        }))
        document.getElementById("header").classList.remove("fullscreen")
    }

    componentWillUnmount() {
        console.log("asdfasdfas")
    }

    render () {
        return (
            <div className={"shared-note-page " + (this.state.fullScreen ? "fullscreen" : "")}>
                <ViewerWrapper note={this.props.note} fullScreen={this.state.fullScreen} openFullScreen={this.openFullScreen} closeFullScreen={this.closeFullScreen}/>
            </div>
        )
    }
}