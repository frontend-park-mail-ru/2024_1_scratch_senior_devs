import {ScReact} from '@veglem/screact';
import {Button} from '../Button/Button';
import {AppDispatcher} from '../../modules/dispatcher';
import {NotesActions} from '../../modules/stores/NotesStore';
import './DeleteNoteDialog.sass';

export class DeleteNoteDialog extends ScReact.Component<any, any>{

    deleteNote = () => {
        AppDispatcher.dispatch(NotesActions.DELETE_NOTE);
        this.props.handleClose();
    };

    render() {
        return (
            <div className="delete-note-dialog">
                <h2>Удалить заметку?</h2>
                <span>Заметка и данные в ней будут удалены без возможности восстановления</span>
                <div className="buttons-container">
                    <Button label="Удалить" onClick={this.deleteNote}/>
                    <Button label="Отменить" className="cancel-btn" onClick={this.props.handleClose}/>
                </div>
            </div>
        );
    }
}