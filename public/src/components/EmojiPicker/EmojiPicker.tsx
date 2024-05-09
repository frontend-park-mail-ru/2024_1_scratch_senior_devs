import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./EmojiPicker.sass"

export class EmojiPicker extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private openBtnRef

    private emojiData = [
        {
            id: "1F47B",
            name: "grinning face"
        },{
            id: "1F47C",
            name: "grinning face"
        },
    ]

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={"emoji-picker-container " + (this.state.open ? "open" : "")}>
                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="emoji.svg" className="icon"/>
                    <span>Иконка</span>
                </div>

                <div className="emoji-list__container">

                    <div className="emoji-list__top-panel">

                        <div className="emoji-search-bar">
                            <Img src="search.svg" className="search-icon" />
                            <input type="text" placeholder="Поиск..." />
                        </div>

                    </div>

                    <div className="emoji-list__bottom-panel">
                        {this.emojiData.map(emoji => (
                            <div className="emoji-list__item" key={emoji.id}>
                                <div className="emoji" >
                                    {String.fromCodePoint(parseInt(emoji.id, 16))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        )
    }
}