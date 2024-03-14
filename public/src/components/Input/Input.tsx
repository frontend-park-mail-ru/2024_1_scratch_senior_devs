import {ScReact} from "@veglem/screact";
import "./Input.sass"

type ValidationResult = {
    result: boolean,
    message: string
}

type InputState = {
    type: string,
    isPassword: boolean,
    placeholder: string,
    icon: string,
    hasIcon: boolean
    validation: (value: string) => ValidationResult
}


export class Input extends ScReact.Component<any, InputState>{
    state = {
        type: "text",
        isPassword: false,
        placeholder: "",
        icon: "",
        hasIcon: false,
        error: "",
        validationResult: false,
        validation: () => {}
    }

    componentDidMount() {
        this.setState(state => ({
            ...state,
            type: this.props.type ? this.props.type : "text",
            placeholder: this.props.placeholder ? this.props.placeholder : "",
            isPassword: this.props.type == "password",
            icon: this.props.icon ? this.props.icon : "",
            hasIcon: this.props.icon != undefined,
            validation: this.props.validation
        }))
    }

    toggleInputType() {
        this.setState(state => ({
            ...state,
            type: state.type == "password" ? "text" : "password"
        }))
    }

    handleChange(e) {
        let {result, message} = this.state.validation(e.target.value)

        this.setState(state => ({
            ...state,
            validationResult: result,
            error: message ? message : ""
        }))

    }

    render() {
        return (
            <div className={"input-container " + (this.state.validationResult ? "success" : "") + (this.state.error != "" ? "error" : "")}>

                <input type={this.state.type} placeholder={this.state.placeholder} oninput={(e) => this.handleChange(e)}/>

                <div className="errors-container">
                    {this.state.error != "" ? this.state.error : ""}
                </div>

                {this.state.isPassword ?
                    <div className="password-toggle-btn-container" onclick={() => this.toggleInputType()}>
                        <img className="password-toggle-btn show-btn" src="/src/assets/eye-slash.svg" alt=""/>
                        <img className="password-toggle-btn hide-btn" src="/src/assets/eye.svg" alt=""/>
                    </div>
                    : ""
                }

                {this.state.hasIcon ? <img className="icon" src={this.state.icon} alt=""/>: ""}

            </div>
        )
    }
}