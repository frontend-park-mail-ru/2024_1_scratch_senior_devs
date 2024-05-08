import {ScReact} from '@veglem/screact';
import {Button} from '../Button/Button';
import './InviteUserModal.sass';
import {Input} from "../Input/Input";
import {ValidateLogin} from "../../modules/validation";
import {Img} from "../Image/Image";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppNotesStore, NotesActions} from "../../modules/stores/NotesStore";
import {AppUserStore} from "../../modules/stores/UserStore";

export class InviteUserModal extends ScReact.Component<any, any>{
    state = {
        value: '',
        validationResult: null,
        errorMessage: ''
    };

    setValue = (value:string) => {
        this.setState(state => ({
            ...state,
            value: value
        }));
    };

    setError = (value:string) => {
        this.setState(state => ({
            ...state,
            validationResult: false,
            errorMessage: value
        }));
    };

    setValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            validationResult: value
        }));
    };

    cleanError = () => {
        this.setState(state => ({
            ...state,
            validationResult: true,
            errorMessage: ''
        }));
    };

    check = () => {
        const {message, result} = ValidateLogin(this.state.value);

        this.setValidated(result);

        if (!result) {
            this.setError(message);
        } else {

            if (this.state.value == AppUserStore.state.username) {
                this.setError("Вы не можете пригласить себя")
                return
            }

            this.cleanError();
        }
    };

    handleChange = (value:string) => {
        this.setValue(value)
        this.check()
    };

    handleSubmit = (e) => {
        e.preventDefault()
        this.check()
        if (this.state.validationResult) {
            AppDispatcher.dispatch(NotesActions.ADD_COLLABORATOR, {
                note_id: AppNotesStore.state.selectedNote.id,
                username: this.state.value
            })

            this.props.handleClose()
        }
    }

    render() {
        return (
            <form className="invite-user-form" onsubmit={this.handleSubmit}>
                <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                <h2>Пригласить пользователя</h2>
                <Input value={this.state.value} onChange={this.handleChange} placeholder="Логин" focused={true} error={this.state.errorMessage} validationResult={this.state.validationResult} />
                <Button label="Отправить" />
            </form>
        );
    }
}

export default InviteUserModal