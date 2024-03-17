import {ScReact} from "@veglem/screact";
import "./NoteEditor.sass"
import {Img} from "../Image/Image";


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

    deleteNote = () => {
        // TODO
    }

    render() {
        return (
            <div className={"note-editor " + (this.state.isOpen ? "active" : "") }>

                <div className="top-panel">
                    <div className="left-container">
                        <div className="item">
                            <Img src="/src/assets/bold.svg" className="icon" onClick={this.deleteNote}/>
                        </div>
                        <div className="item">
                            <Img src="/src/assets/justify-left.svg" className="icon" onClick={this.deleteNote}/>
                        </div>
                    </div>
                    <div className="right-container">
                        <Img src="/src/assets/trash.svg" className="icon" onClick={this.deleteNote}/>
                        <Img src="/src/assets/close.svg" className="icon" onClick={this.closeEditor}/>
                    </div>
                </div>

                <div className="bottom-panel">
                    <div className="note-title-container" contentEditable="true">
                        <h3 className="note-title">Mock note title</h3>
                    </div>

                    <div className="note-content" contentEditable="true">
                        <span>Mock note content</span>
                    </div>
                </div>

            </div>
        )
    }
}