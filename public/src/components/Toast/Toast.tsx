import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./Toast.sass"

export class Toast extends ScReact.Component<any, any> {
    state = {
        open: true
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState(state => ({
                ...state,
                open: false
            }))

            this.unmount() // TODO
        }, 3000)
    }

    render() {
        return (
            <div className={"toast success " + (this.state.open ? "" : "hide")}>
                <div className="toast-content">
                    <Img src="/src/assets/success.svg" className="toast-icon"/>
                    <div className="content">
                        <span className="title">Успех</span>
                        <span className="message">Пароль успешно изменен</span>
                    </div>
                </div>
                <Img src="/src/assets/close.svg" className="toast-close-btn"/>
                <div className="progress"></div>
            </div>
        )
    }
}