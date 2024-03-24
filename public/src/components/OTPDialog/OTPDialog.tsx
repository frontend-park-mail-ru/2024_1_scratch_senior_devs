import {ScReact} from "@veglem/screact";
import "./OTPDIalog.sass"

export class OTPDialog extends ScReact.Component<any, any>{
    state = {
        inputRef: undefined,
        activeOTPIndex: 0
    }

    handleOnChange = (e, index) => {
        console.log("handleOnChange")
        const value = e.target.value

        const newOTP:string[] = [...this.props.value]
        newOTP[index] = value.substring(value.length - 1)

        this.setState(state => ({
            ...state,
            inputRef: e.target as HTMLElement,
            activeOTPIndex: !value ? index - 1 : index + 1
        }))

        console.log(newOTP)
        this.props.setValue(newOTP)
    }

    handleOnKeyDown = (e, index) => {
        console.log("handleOnKeyDown")
        if (e.key === "Backspace") {
            const newOTP:string[] = [...this.props.value]

            if (newOTP[index] !== "") {
                newOTP[index] = ""
            } else if (newOTP[index - 1] !== "") {
                newOTP[index - 1] = ""
            }

            this.setState(state => ({
                ...state,
                activeOTPIndex: index - 1
            }))

            console.log(newOTP)

            this.props.setValue(newOTP)
        }
    }

    componentDidUpdate() {

        // TODO: возвращает object вместо HTMLElement
        // console.log("componentDidUpdate")
        // console.log(typeof this.state.inputRef)
        // this.state.inputRef?.focus()

        const input = document.querySelector(`.input-field input:nth-child(${this.state.activeOTPIndex + 1})`) as HTMLElement
        if (this.props.open && input) {
            input.focus()
        }
    }

    render() {
        return (
            <div className={"otp-dialog-container " + (this.props.open ? "open" : "")}>
                <h4>Введите OTP код</h4>
                <div className="input-field">
                    {this.props.value.map((_, index) => {
                        return (
                            <input type="text" key1={index} value={this.props.value[index]} oninput={(e) => this.handleOnChange(e, index)} onkeydown={(e) => this.handleOnKeyDown(e, index)}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}