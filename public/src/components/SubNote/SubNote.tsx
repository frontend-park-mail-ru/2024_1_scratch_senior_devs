import {ScReact} from "@veglem/screact";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import {Img} from "../Image/Image";
import "./SubNote.sass"
import {AppToasts} from "../../modules/toasts";

export class SubNote extends ScReact.Component<any, any> {
    state = {
        loading: false
    }

    // TODO: ?
    // componentDidMount() {
    //     setTimeout(() => {
    //         this.setState(state => ({
    //             ...state,
    //             loading: false
    //         }))
    //     }, 500)
    // }

    handleClick = () => {
        if (this.state.loading) {
            return
        }

        if (this.props.note.id) {
            AppDispatcher.dispatch(NotesActions.OPEN_NOTE, this.props.note.id)
        } else {
            AppToasts.info("Данной заметки не существует")
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