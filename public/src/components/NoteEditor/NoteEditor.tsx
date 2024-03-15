import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Image} from "../Image/Image";


export class NoteEditor extends ScReact.Component<any, any> {

    state = {
        isOpen: true
    }

    setIsOpen = (value:boolean) => {
        this.setState(state => ({
            ...state,
            isOpen: value
        }))
    }

    closeEditor = () => {
        this.setIsOpen(false)
    }

    render() {
        return (
            <div className={"note-editor " + (this.state.isOpen ? "active" : "") }>

                <div className="note-title">
                    <h2>Mock note title</h2>
                </div>

                <div className="note-content">
                    <span>Mock note content</span>
                </div>

                <Image src="/src/assets/close.svg" className="close-editor-btn" onClick={this.closeEditor}/>

            </div>
        )
    }
}