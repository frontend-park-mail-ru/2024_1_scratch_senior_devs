import {ScReact} from "@veglem/screact";
import "./OTPDIalog.sass"

export class OTPDialog extends ScReact.Component<any, any>{
    state = {
        inputRef: undefined, // TODO
        activeOTPIndex: 0
    }

    handleOnChange = (e, index:number) => {
        console.log("handleOnChange")
        const value = e.target.value

        const newOTP:string[] = [...this.props.value]
        newOTP[index] = e.target.selectionStart == 1 ? value[0] : value.substring(1)


        this.setState(state => ({
            ...state,
            inputRef: e.target as HTMLElement, // TODO
            activeOTPIndex: !value ? index - 1 : index + 1
        }))

        this.props.setValue(newOTP)
    }

    handleOnKeyDown = (e, index: number) => {
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
        console.log("componentDidUpdate")

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
            <div className={"otp-dialog-container " + (this.props.open ? "open " : "") + (this.props.error ? " error" : "")}>
                <span>Введите OTP код</span>
                <div className="input-field">
                    {this.props.value.map((_, index) => (
                        <input type="text" key1={index} value={this.props.value[index]} oninput={(e) => this.handleOnChange(e, index)} onkeydown={(e) => this.handleOnKeyDown(e, index)} />
                    ))}
                </div>
            </div>
        )
    }
}