import {ScReact} from '@veglem/screact';
import './Input.sass';
import '../../../src/assets/eye.svg';
import '../../../src/assets/eye-slash.svg';

type InputState = {
    type?: string,
    isPassword?: boolean,
    placeholder?: string,
    icon?: string,
    hasIcon?: boolean
}

type InputProps = {
    validationResult: boolean,
    error: string,
    value: string,
    type?: string,
    placeholder: string,
    icon?: string,
    onChange: (value:string) => void
}

export class Input extends ScReact.Component<InputProps, InputState>{
    state:InputState = {

    };

    componentDidMount() {
        this.setState(state => ({
            ...state,
            type: this.props.type ? this.props.type : 'text',
            placeholder: this.props.placeholder ? this.props.placeholder : '',
            isPassword: this.props.type == 'password',
            icon: this.props.icon ? this.props.icon : '',
            hasIcon: this.props.icon != undefined
        }));
    }

    toggleInputType = () => {
        this.setState(state => ({
            ...state,
            type: state.type == 'password' ? 'text' : 'password'
        }));
    };

    handleChange = (e) => {
        this.props.onChange && this.props.onChange(e.target.value);
    };

    render() {
        return (
            <div className="input-wrapper">

                <div className={'input-container ' + (this.props.validationResult ? 'success' : '') + (this.props.error  ? 'error' : '') + (this.state.hasIcon  ? ' has-icon' : '')}>
                    <input type={this.state.type} placeholder=" " value={this.props.value} oninput={this.handleChange}/>
                    <div className="input-container__label">{this.state.placeholder}</div>
                    <div className="input-container__underline"></div>

                    {this.state.isPassword ?
                        <div className="password-toggle" onclick={this.toggleInputType}>
                            <img className="password-toggle__btn password-toggle__btn-show-btn" src="/src/assets/eye-slash.svg" alt=""/>
                            <img className="password-toggle__btn password-toggle__btn-hide-btn" src="/src/assets/eye.svg" alt=""/>
                        </div> : ''
                    }

                    {this.state.hasIcon ? <img className="icon" src={this.state.icon} alt=""/> : ''}

                </div>

                <div className="errors-container">
                    {this.props.error != '' ? this.props.error : ''}
                </div>

            </div>
        );
    }
}