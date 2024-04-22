import {ScReact} from "@veglem/screact";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import {Img} from "../Image/Image";
import "./SubNote.sass"

export class SubNote extends ScReact.Component<any, any> {
    handleClick = () => {
        try {
            AppDispatcher.dispatch(NotesActions.OPEN_NOTE, this.props.note.id)
        } catch {
            console.log("asdfasdfasdfasdasdf")
        }
    }

    render() {
        return (
            <div className="note-link-container" onclick={this.handleClick}>
                <Img src="note.svg" className="note-icon"/>
                <span>{this.props.note.title}</span>
            </div>
        )
    }
}

export default SubNote