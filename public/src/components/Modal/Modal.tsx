import {ScReact} from "@veglem/screact";
import "./Modal.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {Button} from "../Button/Button";

export class Modal extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
        document.addEventListener('click', this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (e.target.classList.contains("overlay")) {
            AppDispatcher.dispatch(NotesActions.CLOSE_DELETE_NOTE_DIALOG)
        }
    }

    componentWillUnmount() {
        AppNotesStore.UnSubscribeToStore(this.updateState)
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => ({
            ...state,
            open: store.modalOpen
        }))
    }

    closeModal = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_DELETE_NOTE_DIALOG)
    }

    deleteNote = () => {
        AppDispatcher.dispatch(NotesActions.DELETE_NOTE)
    }

    render() {
        return (
            <div className={"modal-wrapper " + (this.state.open ? "active" : "")}>
                <div className="overlay"></div>
                <div className="modal-content">
                    <h3>Удалить заметку?</h3>
                    <span>Заметка и данные в ней будут удалены без возможности восстановления</span>
                    <div className="buttons-container">
                        <Button label="Удалить" onClick={this.deleteNote}/>
                        <Button label="Отменить" onClick={this.closeModal}/>
                    </div>
                    <Img src="/src/assets/close.svg" className="close-modal-btn" onClick={this.closeModal}/>
                </div>
            </div>

        )
    }
}