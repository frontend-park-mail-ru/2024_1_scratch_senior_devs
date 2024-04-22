import {ScReact} from "@veglem/screact";
import "./SubNotesList.sass"
import {Img} from "../Image/Image";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";

export class SubNotesList extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private openBtnRef
    private panelRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !this.panelRef.contains(e.target)) {
            this.toggleOpen();
        }
    };

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    openSubNote = (note) => {
        this.setState(state => ({
            ...state,
            open: false
        }))

        AppDispatcher.dispatch(NotesActions.OPEN_NOTE, note.id)
    }

    render() {
        return (
            <div className="sub-notes-wrapper">
                <Img src="book.svg" onClick={this.toggleOpen} ref={ref => this.openBtnRef = ref}/>
                <div className={"sub-notes-container " + (this.state.open ? "open" : "")} ref={ref => this.panelRef = ref}>
                    <div className="top-container">
                        <h3>Подзаметки</h3>
                        <div className="add-note-icon-wrapper" onclick={() => AppDispatcher.dispatch(NotesActions.CREATE_SUB_NOTE)}>
                            <Img src="plus.svg" className="add-note-icon"/>
                        </div>
                    </div>
                    <div className="sub-notes-list">
                        {this.props.notes?.map(note => (
                            <div className="sub-note" onclick={() => this.openSubNote(note)}>
                                <span>{note.title}</span>
                            </div>
                        ))}
                        {this.props.notes?.length == 0 ? <span className="not-found-label">Подзаметок нет</span> : ""}
                    </div>
                </div>
            </div>
        )
    }
}

export default SubNotesList