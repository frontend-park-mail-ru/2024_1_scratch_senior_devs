import {ScReact} from '@veglem/screact';
import './DeleteNoteDialog.sass';
import {Img} from "../Image/Image";
import {uiKit} from '@veglem/ui-kit/dist/ui';

export class DeleteNoteDialog extends ScReact.Component<any, any>{

    deleteNote = () => {
        this.props.onSuccess()
        this.props.handleClose();
    };

    render() {
        const {Button} = uiKit

        return (
            <div className="delete-note-dialog">
                <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
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