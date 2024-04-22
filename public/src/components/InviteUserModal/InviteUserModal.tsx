import {ScReact} from '@veglem/screact';
import {Button} from '../Button/Button';
import './InviteUserModal.sass';
import {Input} from "../Input/Input";
import {ValidateLogin} from "../../modules/validation";
import {AppToasts} from "../../modules/toasts";

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
            this.props.handleClose()
            AppToasts.success("Приглашение успешно отправлено")
            setTimeout(() => {
                this.setValue("")
                this.setValidated(null)
            }, 300)
        }
    }

    render() {
        return (
            <form className="invite-user-form" onsubmit={this.handleSubmit}>
                <h2>Пригласить пользователя</h2>
                <Input value={this.state.value} onChange={this.handleChange} placeholder="Логин" error={this.state.errorMessage} validationResult={this.state.validationResult} />
                <Button label="Отправить" />
            </form>
        );
    }
}

export default InviteUserModal