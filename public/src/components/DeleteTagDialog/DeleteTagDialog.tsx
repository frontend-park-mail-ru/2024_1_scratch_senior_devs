import {ScReact} from '@veglem/screact';
import {Button} from '../Button/Button';
import './DeleteTagDialog.sass';
import {Img} from "../Image/Image";

export class DeleteTagDialog extends ScReact.Component<any, any>{

    onSuccessBtnClick = () => {
        this.props.onSuccess()
        this.props.handleClose();
    };

    render() {
        return (
            <div className="delete-tag-dialog">
                <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                <h2>Удалить тэг?</h2>
                <span>Тэг будет удален без возможности восстановления</span>
                <div className="buttons-container">
                    <Button label="Удалить" onClick={this.onSuccessBtnClick}/>
                    <Button label="Отменить" className="cancel-btn" onClick={this.props.handleClose}/>
                </div>
            </div>
        );
    }
}