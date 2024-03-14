import {ScReact} from "@veglem/screact";
import "./Input.sass"

type InputState = {
    type: string,
    isPassword: boolean
}


export class Input extends ScReact.Component<any, InputState>{
    state = {
        type: "text",
        isPassword: false
    }

    componentDidMount() {
        this.setState(state => ({
            ...state,
            type: this.props.type,
            isPassword: this.props.type == "password"
        }))
    }

    toggleInputType() {
        console.log("toggleInputType")
        this.setState(state => ({
            ...state,
            type: state.type == "password" ? "text" : "password"
        }))
    }

    render() {
        return (
            <div className="input-container">

                <img src="" alt=""/>

                <input type={this.state.type} placeholder="placeholder"/>

                <div className="errors-container">

                </div>

                { this.state.isPassword ?
                    <div className="password-toggle-btn-container" onclick={() => this.toggleInputType()}>
                        <img className="password-toggle-btn show-btn" src="/src/assets/eye-slash.svg"  alt="" />
                        <img className="password-toggle-btn hide-btn" src="/src/assets/eye.svg"  alt="" />
                    </div>
                    : ""
                }

            </div>
        )
    }
}