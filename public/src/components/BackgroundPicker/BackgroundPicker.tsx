import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./BackgroundPicker.sass"

export class BackgroundPicker extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private openBtnRef

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    render() {
        return (
            <div className="background-picker-container">
                <div className="open-btn" onClick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="image.svg" className="icon"/>
                    <span>Шапка</span>
                </div>

            </div>
        )
    }
}