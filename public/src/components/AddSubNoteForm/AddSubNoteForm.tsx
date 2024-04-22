import {ScReact} from "@veglem/screact";
import "./AddSubNoteForm.sass"
import SearchBar from "../SearchBar/SearchBar";
import {AppNoteRequests} from "../../modules/api";
import {AppUserStore} from "../../modules/stores/UserStore";
import {AppToasts} from "../../modules/toasts";
import {AppNoteStore, NoteStoreActions} from "../../modules/stores/NoteStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {parseNoteTitle} from "../../modules/utils";
import {NoteType} from "../../utils/types";
import {AppNotesStore} from "../../modules/stores/NotesStore";
import {Loader} from "../Loader/Loader";

type AddNoteLinkFormState = {
    query: string,
    selectedNote: {
        id: string,
        title: string
    },
    notes: NoteType[]
}

type AddNoteLinkFormProps = {
    handleClose: () => void
}

export class AddSubNoteForm extends ScReact.Component<AddNoteLinkFormProps, AddNoteLinkFormState> {
    state = {
        query: "",
        selectedNote: null,
        notes: [],
        fetching: false
    }

    fetchNotes = async () => {
        const params:Record<string,any> = {
            title: this.state.query,
            count: 5
        };

        const notes = await AppNoteRequests.GetAll(AppUserStore.state.JWT, params);

        this.setState(state => ({
            ...state,
            fetching: false,
            notes: notes.filter(note => note.id != AppNotesStore.state.selectedNote?.id)
        }));
    }

    componentDidMount() {
        this.fetchNotes()
    }

    selectNote = (note:NoteType) => {
        this.setState(state => ({
            ...state,
            selectedNote: {
                id: note.id,
                title: parseNoteTitle(note.data.title)
            }
        }));

        this.handleSubmitSelectNote()
    }

    handleSubmitSelectNote = () => {
        if (!this.state.selectedNote) {
            AppToasts.info("Выберите заметку")
            return
        }

        const block = AppNoteStore.state.note.blocks[AppNoteStore.state.dropdownPos.blockId];
        block.type = 'div';
        block.content = undefined;
        block.attributes = {
            note: this.state.selectedNote
        };

        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
            blockId: AppNoteStore.state.dropdownPos.blockId,
            newBlock: block
        });

        AppDispatcher.dispatch(NoteStoreActions.REMOVE_CURSOR)

        this.props.handleClose()
    }

    handleSearch = async (query) => {
        this.setState(state => ({
            ...state,
            query: query
        }))

        await this.fetchNotes()
    }

    onStartTyping = () => {
        this.setState(state => ({
            ...state,
            notes: [],
            fetching: true
        }))
    }

    render() {
        return (
            <div className="add-note-link-form">
                <h3>Выберите заметку</h3>
                <div className="select-note-container">
                    <div className="search-bar-container">
                        <SearchBar onChange={this.handleSearch} onStartTyping={this.onStartTyping}/>
                    </div>
                    <div className="notes-container" data-selected="asdfasd">
                        <Loader active={this.state.fetching}/>
                        {this.state.notes.map(note => (
                            <div className={"note-item " + (this.state.selectedNote?.id == note.id ? "selected" : "") } onclick={() => this.selectNote(note)}>
                                <span>{parseNoteTitle(note.data.title)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default AddSubNoteForm