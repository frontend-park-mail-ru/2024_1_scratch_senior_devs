import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./EmojiPicker.sass"
import {AppNotesStore} from "../../modules/stores/NotesStore";

export class EmojiPicker extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private openBtnRef

    private emojiData = [
        {
            id: "1F47B",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
        {
            id: "1F47C",
            name: "grinning face"
        },
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
        console.log("selectEmoji")
        console.log(emoji)
    }

    render() {
        return (
            <div className={"emoji-picker-container " + (this.state.open ? "open" : "")}>
                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="emoji.svg" className="icon"/>
                    <span>Иконка</span>
                </div>

                <div className="emoji-list">

                    <div className="emoji-list__top-panel">

                        <div className="emoji-search-bar">
                            <Img src="search.svg" className="search-icon" />
                            <input type="text" placeholder="Поиск..." />
                        </div>

                    </div>

                    <div className="emoji-list__bottom-panel">
                        {this.emojiData.map(emoji => (
                            <div className="emoji-list__item" key={emoji.id} onclick={() => this.selectEmoji(emoji)}>
                                {String.fromCodePoint(parseInt(emoji.id, 16))}
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        )
    }
}