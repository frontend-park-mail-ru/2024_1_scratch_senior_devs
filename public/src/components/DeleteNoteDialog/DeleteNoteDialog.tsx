import {ScReact} from "@veglem/screact";
import {Button} from "../Button/Button";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import "./DeleteNoteDialog.sass"

export class DeleteNoteDialog extends ScReact.Component<any, any>{
    closeModal = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_DELETE_NOTE_DIALOG)
    }

    deleteNote = () => {
        AppDispatcher.dispatch(NotesActions.DELETE_NOTE)
        this.closeModal()
    }

    render() {
        return (
            <div className="delete-note-dialog">
                <h2>Удалить заметку?</h2>
                <span>Заметка и данные в ней будут удалены без возможности восстановления</span>
                <div className="buttons-container">
                    <Button label="Удалить" onClick={this.deleteNote}/>
                    <Button label="Отменить" className="cancel-btn" onClick={this.closeModal}/>
                </div>
            </div>
        )
    }
}