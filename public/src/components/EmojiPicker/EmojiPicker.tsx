import {ScReact} from "@veglem/screact";
import "./EmojiPicker.sass"
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";

export class EmojiPicker extends ScReact.Component<any, any> {
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

    selectEmoji = (emoji:string) => {
        AppDispatcher.dispatch(NotesActions.UPDATE_NOTE_ICON, emoji)
    }

    clearEmoji = () => {
        AppDispatcher.dispatch(NotesActions.UPDATE_NOTE_ICON, null)
    }

    render() {
        return (
            <div className="emoji-list-container">

                <div className="emoji-list-container__top-panel">
                    <span onclick={this.clearEmoji}>Очистить</span>
                </div>

                <div className="emoji-list">
                    {this.emojiData.map(emoji => (
                        <div className={"emoji-list__item " + (this.props.icon == emoji ? "selected" : "")} key={emoji} onclick={() => this.selectEmoji(emoji)}>
                            {String.fromCodePoint(parseInt(emoji, 16))}
                        </div>
                    ))}
                </div>

            </div>

        )
    }
}