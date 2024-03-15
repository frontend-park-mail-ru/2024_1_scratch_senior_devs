import {ScReact} from "@veglem/screact";
import "./style.sass"

export class NotesPage extends ScReact.Component<any, any> {



    render() {
        return (
            <div className="notes-page-wrapper">
                <aside>
                    <div className="notes-container">

                    </div>
                </aside>

                <div className="notes-editor">

                    <div className="note-title">

                    </div>

                    <div className="note-content">

                    </div>

                    <img src="/src/assets/close.svg" alt="" className="close-editor-btn"/>

                </div>

            </div>
        )
    }
}