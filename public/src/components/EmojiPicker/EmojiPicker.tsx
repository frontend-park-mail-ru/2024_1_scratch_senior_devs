import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./EmojiPicker.sass"

export class EmojiPicker extends ScReact.Component<any, any> {
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
            <div className="emoji-picker-container">
                <div className="open-btn" onClick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="emoji.svg" className="icon"/>
                    <span>Иконка</span>
                </div>

            </div>
        )
    }
}