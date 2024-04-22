import {ScReact} from '@veglem/screact';
import './Input.sass';
import '../../../src/assets/eye.svg';
import '../../../src/assets/eye-slash.svg';

type InputState = {
    type?: string,
    isPassword?: boolean,
    placeholder?: string,
    icon?: string,
    hasIcon?: boolean,
    underline: boolean
}

type InputProps = {
    validationResult: boolean,
    error: string,
    value: string,
    type?: string,
    placeholder: string,
    icon?: string,
    underline?: boolean
    onChange: (value:string) => void,
}

export class Input extends ScReact.Component<InputProps, InputState>{
    state:InputState = {

    };

    private inputRef

    componentDidMount() {
        this.setState(state => ({
            ...state,
            type: this.props.type ? this.props.type : 'text',
            placeholder: this.props.placeholder ? this.props.placeholder : '',
            isPassword: this.props.type == 'password',
            icon: this.props.icon ? this.props.icon : '',
            hasIcon: this.props.icon != undefined,
            underline: this.props.underline  != undefined ? this.props.underline : true
        }));
    }

    toggleInputType = () => {
        this.setState(state => ({
            ...state,
            type: state.type == 'password' ? 'text' : 'password'
        }));
    };

    handleChange = (e) => {
        e.preventDefault()
        
        this.props.onChange && this.props.onChange(e.target.value);
        this.inputRef.value = this.props.value
    };

    render() {
        return (
            <div className="input-wrapper">
                <div className={'input-container ' + (this.props.validationResult ? 'success' : '') + (this.props.error  ? 'error' : '') + (this.state.hasIcon  ? ' has-icon' : '')}>
                    <input type={this.state.type} placeholder=" " value={this.props.value} oninput={this.handleChange} ref={ref => this.inputRef = ref}/>
                    <div className="label">{this.state.placeholder}</div>
                    <div className="underline"></div>

                    {this.state.isPassword ?
                        <div className="password-toggle-btn-container" onclick={this.toggleInputType}>
                            <img className="password-toggle-btn show-btn" src="/src/assets/eye-slash.svg" alt=""/>
                            <img className="password-toggle-btn hide-btn" src="/src/assets/eye.svg" alt=""/>
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