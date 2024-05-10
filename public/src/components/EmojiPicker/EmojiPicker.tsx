import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./EmojiPicker.sass"

export class EmojiPicker extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private openBtnRef
    private emojiContainer

    private emojiData = [
        "1F602",
        "1F923",
        "1F44D",
        "1F62D",
        "1F64F",
        "1F618",
        "1F970",
        "1F60D",
        "1F60A",
        "1F389",
        "1F601",
        "1F495",
        "1F605",
        "1F525",
        "1F937",
        "1F382",
        "1F973",
        "1F496",
        "1F440",
        "1F4AF",
        "1F44C",
        "1F4A9"
    ]

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !e.target.matches(".emoji-picker-container, .emoji-picker-container *")) {
            this.toggleOpen();
        }
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    selectEmoji = (emoji) => {
        this.props.onChange(emoji)
        this.emojiContainer.innerHTML = String.fromCodePoint(parseInt(emoji, 16))
    }

    render() {
        return (
            <div className={"emoji-picker-container " + (this.state.open ? "open" : "")}>
                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>

                    <div className="emoji-container" ref={ref => this.emojiContainer = ref}>
                        {this.props.icon ? <span>{String.fromCodePoint(parseInt(this.props.icon, 16))}</span> : <Img src="emoji.svg" className="icon"/>}
                    </div>

                    <span>Иконка</span>
                </div>

                <div className="emoji-list-container">

                    <div className="emoji-list">
                        {this.emojiData.map(emoji => (
                            <div className="emoji-list__item" key={emoji} onclick={() => this.selectEmoji(emoji)}>
                                {String.fromCodePoint(parseInt(emoji, 16))}
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        )
    }
}