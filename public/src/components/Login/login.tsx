import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {Input} from '../Input/Input';
import {ValidateLogin, ValidatePassword} from '../../modules/validation';
import {AppDispatcher} from '../../modules/dispatcher';
import {AppUserStore, UserActions, UserStoreState} from '../../modules/stores/UserStore';
import {Link} from '../Link/Link';
import {OTPDialog} from '../OTPDialog/OTPDialog';
import {uiKit} from '@veglem/ui-kit/dist/ui';

const OTP_CODE_LENGTH = 6;

export class LoginForm extends  ScReact.Component<any, any> {
    state = {
        error: false,

        errorLogin: '',
        loginValidationResult: false,
        login: '',

        errorPassword: '',
        passwordValidationResult: false,
        password: '',

        otpDialogOpen: false,
        otpValue: new Array(OTP_CODE_LENGTH).fill('')
    };

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState);
    }

    componentWillUnmount() {
        AppUserStore.UnSubscribeToStore(this.updateState);
    }

    updateState = (store:UserStoreState) => {
        this.setState(state => ({
            ...state,
            error: store.errorLoginForm !== undefined,
            otpDialogOpen: store.otpDialogOpen
        }));

        if (this.state.error) {
            this.setLoginError(store.errorLoginForm);
            this.setLoginValidated(false);
            this.setPasswordError(store.errorLoginForm);
            this.setPasswordValidated(false);
        }
    };

    setOtpValue = (value:string[]) => {
        this.setState(state => ({
            ...state,
            otpValue: value
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.checkLogin();
        this.checkPassword();

        if (this.state.loginValidationResult && this.state.passwordValidationResult) {
            AppDispatcher.dispatch(
                UserActions.LOGIN,
                {
                    username: this.state.login,
                    password: this.state.password,
                    code: this.state.otpValue.join('')
                }
            );
        }
    };

    setLoginValidated = (value:boolean)=> {
        this.setState(state => ({
            ...state,
            loginValidationResult: value
        }));
    };

    setLogin = (value:string) => {
        this.setState(s => {
            return {
                ...s,
                login: value
            };
        });

        this.checkLogin();
    };

    checkLogin = () => {
        const {message, result} = ValidateLogin(this.state.login);
        this.setLoginValidated(result);

        if (!result) {
            this.setLoginError(message);
        } else {
            this.setLoginError('');
        }
    };

    setLoginError = (value:string) => {
        this.setState(state => ({
            ...state,
            errorLogin: value
        }));
    };

    setPassword = (value:string) => {
        this.setState(state => ({
            ...state,
            password: value
        }));

        this.checkPassword();
    };

    checkPassword = () => {
        const {message, result} = ValidatePassword(this.state.password);

        this.setPasswordValidated(result);

        if (!result) {
            this.setPasswordError(message);
        } else {
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

    render(): VDomNode {
        const {Button} = uiKit

        return (
            <form className="login-form">
                <h3>Вход</h3>
                <Input
                    type="text"
                    placeholder="Введите логин"
                    icon="src/assets/user.png"
                    value={this.state.login}
                    error={this.state.errorLogin}
                    validationResult={this.state.loginValidationResult}
                    onChange={this.setLogin}
                />
                <Input
                    type="password"
                    placeholder="Введите пароль"
                    icon="src/assets/password.png"
                    value={this.state.password}
                    error={this.state.errorPassword}
                    validationResult={this.state.passwordValidationResult}
                    onChange={this.setPassword}
                />
                <OTPDialog open={this.state.otpDialogOpen} value={this.state.otpValue} setValue={this.setOtpValue} error={this.state.error}/>
                <Link label="Еще нет аккаунта?" onClick={this.props.toggleForm} />
                <Button label="Войти" onClick={this.handleSubmit} disabled={this.state.otpDialogOpen ? this.state.otpValue.join('').length !== OTP_CODE_LENGTH : false}/>
            </form>
        );
    }
}