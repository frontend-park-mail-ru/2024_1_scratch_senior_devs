import {ScReact} from '@veglem/screact';
import './OTPDIalog.sass';

export class OTPDialog extends ScReact.Component<any, any>{
    state = {
        inputRefs: [],
        activeOTPIndex: 0
    };

    handleOnChange = (e, index:number) => {
        const value = e.target.value;

        const newOTP:string[] = [...this.props.value];
        newOTP[index] = e.target.selectionStart == 1 ? value[0] : value.substring(1);

        this.setState(state => ({
            ...state,
            activeOTPIndex: !value ? index - 1 : index + 1
        }));

        this.props.setValue(newOTP);
    };

    handleOnKeyDown = (e, index: number) => {
        if (e.key === 'Backspace') {
            const newOTP:string[] = [...this.props.value];

            if (newOTP[index] !== '') {
                newOTP[index] = '';
            } else if (newOTP[index - 1] !== '') {
                newOTP[index - 1] = '';
            }

            this.setState(state => ({
                ...state,
                activeOTPIndex: index - 1
            }));

            this.props.setValue(newOTP);
        }
    };

    componentDidUpdate() {
        const input = this.state.inputRefs[this.state.activeOTPIndex];
        if (this.props.open && input) {
            input.focus();
        }
    }

    render() {
        const inputs = this.props.value.map((_, index:number) => (
            <input
                type="text"
                ref={(val) => {this.state.inputRefs[index] = val;}}
                key1={index} value={this.props.value[index]}
                oninput={(e) => this.handleOnChange(e, index)}
                onkeydown={(e) => this.handleOnKeyDown(e, index)}
            />
        ));

        return (
            <div className={'otp-dialog ' + (this.props.open ? 'open ' : '') + (this.props.error ? ' error' : '')}>
                <span className="otp-dialog__title">Введите OTP код</span>
                <div className="otp-dialog__inputs">
                    {inputs}
                </div>
            </div>
        );
    }
}