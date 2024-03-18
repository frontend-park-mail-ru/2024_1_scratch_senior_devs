import {ScReact} from "@veglem/screact";
import "./Input.sass"


type InputState = {
    type?: string,
    isPassword?: boolean,
    placeholder?: string,
    icon?: string,
    hasIcon?: boolean
}


export class Input extends ScReact.Component<any, InputState>{
    state:InputState = {

    }

    componentDidMount() {
        this.setState(state => ({
            ...state,
            type: this.props.type ? this.props.type : "text",
            placeholder: this.props.placeholder ? this.props.placeholder : "",
            isPassword: this.props.type == "password",
            icon: this.props.icon ? this.props.icon : "",
            hasIcon: this.props.icon != undefined
        }))
    }

    toggleInputType = () => {
        this.setState(state => ({
            ...state,
            type: state.type == "password" ? "text" : "password"
        }))
    }

    handleChange = (e) => {
        this.props.onChange && this.props.onChange(e.target.value)
    }

    render() {
        return (
            <div className={"input-container " + (this.props.validationResult ? "success" : "") + (this.props.error ? "error" : "")}>

                <input type={this.state.type} placeholder={this.state.placeholder} value={this.props.value} oninput={this.handleChange}/>

                <div className="errors-container">
                    {this.props.error != "" ? this.props.error : ""}
                </div>

                {this.state.isPassword ?
                    <div className="password-toggle-btn-container" onclick={this.toggleInputType}>
                        <img className="password-toggle-btn show-btn" src="/src/assets/eye-slash.svg" alt=""/>
                        <img className="password-toggle-btn hide-btn" src="/src/assets/eye.svg" alt=""/>
                    </div> : ""
                }

                {this.state.hasIcon ? <img className="icon" src={this.state.icon} alt=""/>: ""}

            </div>
        )
    }
}