import {ScReact} from "@veglem/screact";
import "./Input.sass"

type InputState = {
    hide: boolean,
    type: string,
    isPassword: boolean
}


export class Input extends ScReact.Component<any, InputState>{

    componentDidMount() {
        console.log("componentDidMount")
        this.setState((state) => {
            console.log({
                type: this.props.type, isPassword: this.props.type == "password", ...state
            })
            return {
                type: this.props.type, isPassword: this.props.type == "password", ...state
            }
        })
    }

    render() {
        console.log(this.state)

        return (
            <div className="input-container">

                <img src="" alt=""/>

                <input type={this.props.type} placeholder="placeholder"/>

                <div className="errors-container">

                </div>

                {/*{ this.isPassword && <img class="password-toggle-btn show-btn" src="/src/assets/eye-slash.svg" /> }*/}
                {/*{ this.isPassword && <img class="password-toggle-btn show-btn" src="/src/assets/eye-slash.svg" /> }*/}

            </div>
        )
    }
}