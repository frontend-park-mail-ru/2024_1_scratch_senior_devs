import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import './style.sass';
import {LoginForm} from '../../components/Login/login';
import {RegisterForm} from '../../components/Register/Register';
import {ShineButton} from '../../components/ShineButton/ShineButton';

export class AuthPage extends ScReact.Component<any, any> {
    state = {
        selectedForm: 'login',
        toggled: false,
        inToggle: false
    };

    componentDidMount() {
        this.setState(state => ({
            ...state,
            selectedForm: window.location.pathname.replace('/', '')
        }));

        document.title = this.state.selectedForm === 'login' ? 'Вход' : 'Регистрация';
    }

    toggleForm = () => {
        if (this.state.inToggle) {
            return;
        }

        this.setState(state => ({
            selectedForm: state.selectedForm === 'login' ? 'register' : 'login',
            toggled: true,
            inToggle: true
        }));

        setTimeout(() => {
            this.state.inToggle = false;
        }, 500);

        history.pushState(null, null, this.state.selectedForm);
        document.title = this.state.selectedForm === 'login' ? 'Вход' : 'Регистрация';
    };

    render(): VDomNode {
        return (
            <div className={'auth-page-wrapper ' + (window.location.pathname.includes('login') ? (this.state.selectedForm === 'login' ? '' : 'active') : (this.state.toggled ? '' : 'active'))}>
                <div className="glassmorphism-container">
                    <div className="auth-container">
                        <div className="form-container sign-in">
                            <LoginForm toggleForm={this.toggleForm}/>
                        </div>
                        <div className={'form-container sign-up' + (this.state.toggled ? ' fade-left' : '') + (window.location.pathname.includes('login') && this.state.toggled ? ' fade-right' : '')}>
                            <RegisterForm toggleForm={this.toggleForm}/>
                        </div>
                        <div className="toggle-container">
                            <div className="toggle">
                                <div className="toggle-panel toggle-left">
                                    <h2>Уже есть аккаунт?</h2>
                                    <ShineButton label="Войти" onClick={this.toggleForm} />
                                </div>
                                <div className="toggle-panel toggle-right">
                                    <h2>Ещё нет аккаунта?</h2>
                                    <ShineButton label="Зарегистрироваться" onClick={this.toggleForm} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}