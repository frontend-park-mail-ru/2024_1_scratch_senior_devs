import {ScReact} from '@veglem/screact';
import {Input} from '../Input/Input';
import './UpdatePasswordModal.sass';
import {ValidatePassword} from '../../modules/validation';
import {AppDispatcher} from '../../modules/dispatcher';
import {UserActions} from '../../modules/stores/UserStore';
import {Img} from "../Image/Image";
import {uiKit} from '@veglem/ui-kit/dist/ui';

export class UpdatePasswordForm extends ScReact.Component<any, any> {
    state = {
        password: '',
        errorPassword: '',
        passwordValidationResult: false,

        repeatPassword: '',
        errorRepeatPassword: '',
        repeatPasswordValidationResult: false,
    };

    setPassword = (value:string) => {
        this.setState(state => ({
            ...state,
            password: value
        }));

        this.checkPassword();

        this.checkRepeatPassword();
    };

    checkPassword = () => {
        if (this.state.password.length > 0 && this.state.password == this.state.repeatPassword) {
            this.setRepeatPasswordError('Пароли совпадают');
            this.setPasswordError('Пароли совпадают');
            this.setPasswordValidated(false);
            this.setRepeatPasswordValidated(false);
            return;
        }

        const {message, result} = ValidatePassword(this.state.password);

        if (!result) {
            this.setPasswordValidated(false);
            this.setPasswordError(message);
        } else {
            this.setPasswordValidated(true);
            this.setPasswordError('');
        }
    };

    setPasswordError = (value:string) => {
        this.setState(state => ({
            ...state,
            errorPassword: value
        }));
    };

    setPasswordValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            passwordValidationResult: value
        }));
    };

    setRepeatPassword = (value:string) => {
        this.setState(state => ({
            ...state,
            repeatPassword: value
        }));

        this.checkPassword();
        this.checkRepeatPassword();
    };

    checkRepeatPassword = () => {
        if (this.state.repeatPassword.length > 0 && this.state.password == this.state.repeatPassword) {
            this.setRepeatPasswordError('Пароли совпадают');
            this.setPasswordError('Пароли совпадают');
            this.setPasswordValidated(false);
            this.setRepeatPasswordValidated(false);
            return;
        }

        const {message, result} = ValidatePassword(this.state.repeatPassword);

        if (!result) {
            this.setRepeatPasswordValidated(false);
            this.setRepeatPasswordError(message);
        } else {
            this.setRepeatPasswordValidated(true);
            this.setRepeatPasswordError('');
        }
    };

    setRepeatPasswordError = (value:string) => {
        this.setState(state => ({
            ...state,
            errorRepeatPassword: value
        }));
    };

    setRepeatPasswordValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            repeatPasswordValidationResult: value
        }));
    };

    handleSubmit = () => {
        this.checkPassword();
        this.checkRepeatPassword();

        if (this.state.passwordValidationResult && this.state.repeatPasswordValidationResult) {
           AppDispatcher.dispatch(UserActions.UPDATE_PASSWORD, {
               oldPassword: this.state.password,
               newPassword: this.state.repeatPassword
           });
        }
    };

    render() {
        const {Button} = uiKit

        return (
            <div className="change-password-form">
                <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                <h2>Форма изменения пароля</h2>
                <Input
                    type="password"
                    placeholder="Старый пароль"
                    icon="src/assets/password.png"
                    value={this.state.password}
                    onChange={this.setPassword}
                    error={this.state.errorPassword}
                    validationResult={this.state.passwordValidationResult}
                />
                <Input
                    type="password"
                    placeholder="Новый пароль"
                    icon="src/assets/password.png"
                    value={this.state.repeatPassword}
                    onChange={this.setRepeatPassword}
                    error={this.state.errorRepeatPassword}
                    validationResult={this.state.repeatPasswordValidationResult}
                />
                <Button label="Изменить" onClick={this.handleSubmit}/>
            </div>
        );
    }
}