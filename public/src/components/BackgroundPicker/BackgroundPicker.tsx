import {ScReact} from "@veglem/screact";
import "./BackgroundPicker.sass"
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";

export class BackgroundPicker extends ScReact.Component<any, any> {
    private backgroundData = [
        "linear-gradient( 109.6deg,  rgba(57,106,252, 0.6) 11.2%, rgba(48,86,253, 0.6) 91.1% )",
        "linear-gradient(-225deg, rgba(101, 55, 155, 0.7) 0%, rgba(136, 106, 234, 0.7) 53%, rgba(100, 87, 198, 0.7) 100%);",
        "linear-gradient(to right, rgba(247, 140, 160, 0.6) 0%, rgba(249, 116, 143, 0.6) 19%, rgba(253, 134, 140, 0.7) 60%, rgba(254, 154, 139, 0.7) 100%)",
        "linear-gradient(to top, rgba(230, 185, 128, 0.6) 0%, rgba(234, 205, 163, 0.6) 100%);",
        "linear-gradient(-20deg, rgba(252, 96, 118, 0.6) 0%, rgba(255, 154, 68,  0.6) 100%);",
        "linear-gradient(to top,rgba(0, 106, 78, 0.9) 0%, rgba(0, 106, 78, 0.9) 100%);",
        "linear-gradient(to top, rgba(247, 112, 98, 0.6) 0%, rgba(254, 81, 150, 0.6) 100%);",
        "linear-gradient(135deg, rgba(139, 198, 236, 0.6) 0%, rgba(149, 153, 226, 0.6) 100%)"
    ]

    selectBackground = (bg:string) => {
        AppDispatcher.dispatch(NotesActions.UPDATE_NOTE_BACKGROUND, bg)
    }

    clearBackground = () => {
        AppDispatcher.dispatch(NotesActions.UPDATE_NOTE_BACKGROUND, null)
    }

    render() {
        return (
            <div className="background-list-container">

                <div className="background-list-container__top-panel">
                    <span onclick={this.clearBackground}>Очистить</span>
                </div>

                <div className="background-list">
                    {this.backgroundData.map(bg => (
                        <div className="background-list__item" key={bg} onclick={() => this.selectBackground(bg)} style={`background: ${bg};`}></div>
                    ))}
                </div>

            </div>
        )
    }
}