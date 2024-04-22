import {ScReact} from '@veglem/screact';
import './style.sass';
import SearchBar from '../../components/SearchBar/SearchBar';
import {NoteEditor} from '../../components/NoteEditor/NoteEditor';
import {AppNotesStore, NotesActions, NotesStoreState} from '../../modules/stores/NotesStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {Button} from '../../components/Button/Button';
import {Img} from '../../components/Image/Image';
import {AppNoteStore, NoteStoreActions} from '../../modules/stores/NoteStore';
import {Loader} from '../../components/Loader/Loader';
import {formatDate, scrollToTop, truncate} from '../../modules/utils';

export class NotesPage extends ScReact.Component<any, any> {
    state = {
        notes: [],
        selectedNote: undefined,
        editorOpen: false,
        fetching: false
    };

    private notesContainerRef

    componentDidMount() {
        document.title = 'Заметки';

        scrollToTop()

        AppNotesStore.SubscribeToStore(this.updateState);

        // AppNoteStore.AddSaver(this.updateNotesTitles);

        this.setState(state => ({
            ...state,
            notes: this.props.notes
        }));

        if (this.props.note) {
            this.setState(state => ({
                ...state,
                editorOpen: true
            }));

            AppDispatcher.dispatch(NotesActions.SELECT_NOTE, this.props.note);
        }

        if (this.props.notes.length == 10) {
            this.createObserver();
        }
    }

    updateNotesTitles = () => {
        setTimeout(()=> {
            const notes = AppNotesStore.state.notes;
            notes.forEach((note, index) => {
                if (note.id == this.state.selectedNote?.id) {
                    console.log(AppNoteStore.state.note.title)
                    notes[index].data.title = AppNoteStore.state.note.title == "" ? "Пустая заметка" : AppNoteStore.state.note.title;
                    notes[index].update_time = new Date()
                }
            });

            this.setState(s=>({
                ...s,
                notes: notes
            }));

        }, 10);
    };

    componentWillUnmount() {
        AppDispatcher.dispatch(NotesActions.EXIT);
        AppNotesStore.UnSubscribeToStore(this.updateState);
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => {
            if (state.notes.length > 0 && state.notes.length < store.notes.length) {
                this.createObserver();
            }

            if (store.selectedNote != undefined) {
                document.title = store.selectedNote.data.title ? store.selectedNote.data.title : "Пустая заметка";
            }

            return {
                ...state,
                selectedNote: store.selectedNote,
                editorOpen: store.selectedNote != undefined,
                notes: store.notes,
                fetching: store.fetching
            };
        });
    };

    handleSelectNote = (e) => {
        let id = undefined;

        if (e.target.matches('.note-container')) {
            id = e.target.id;
        } else if (e.target.matches('.note-container *')) {
            id = e.target.parentNode.id;
        }

        if (id && this.state.selectedNote?.id !== id) {
            this.setState(state => ({
                ...state,
                editorOpen: true
            }));

            document.body.classList.add('locked');

            AppDispatcher.dispatch(NotesActions.OPEN_NOTE, id);

        }
    };

    closeEditor = () => {
        this.setState(state => ({
            ...state,
            editorOpen: false
        }));

        document.title = 'Заметки';

        history.pushState(null, null, '/notes');

        document.body.classList.remove('locked');
    };

    createObserver() {
        console.log("createObserver")
        const observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            AppDispatcher.dispatch(NotesActions.LOAD_NOTES);
                            observer.unobserve(entry.target);
                        }, 500);
                    }
                });
            });

        const lastNote = this.notesContainerRef.lastChild;
        lastNote && observer.observe(lastNote);
    }

    searchNotes = (value:string) => {
        AppDispatcher.dispatch(NotesActions.SEARCH_NOTES, value);
    };

    createNewNote = () => {
        AppDispatcher.dispatch(NotesActions.CREATE_NEW_NOTE, true);
    };

    onSearchBarStartTyping = () => {
        AppDispatcher.dispatch(NoteStoreActions.REMOVE_CURSOR)
        AppDispatcher.dispatch(NotesActions.START_FETCHING)
    }

    onChangeSelectedNoteTitle = (title:string) => {
        const selectedNote = document.getElementById(this.state.selectedNote.id);

        if (selectedNote) {
            const noteTitle = selectedNote.querySelector('h3');
            noteTitle.innerHTML = title.length > 0 ? truncate(title, 20) : "Пустая заметка";
            document.title = noteTitle.innerHTML
        }

        this.updateNotesTitles()
    };

    onChangeSelectedNoteContent = () => {
        this.updateNotesTitles()
    }

    render() {
        return (
            <div className={'notes-page-wrapper ' + (this.state.editorOpen ? 'active' : '')} >
                <aside>
                    <div className="top-panel">
                        <SearchBar onStartTyping={this.onSearchBarStartTyping} onChange={this.searchNotes} />
                        <div className="add-note-btn-container" onclick={this.createNewNote}>
                            <Button label="Новая заметка" className="add-note-btn" />
                            <div className="add-note-icon-wrapper">
                                <Img src="plus.svg" className="add-note-icon" />
                            </div>
                        </div>
                    </div>
                    <div className="notes-container" onclick={this.handleSelectNote}  ref={ref => this.notesContainerRef = ref}>
                        <Loader active={this.state.fetching}/>
                        {
                            this.state.notes.length > 0 ?
                                this.state.notes.map(note => (
                                <div
                                    className={'note-container ' + (this.state.selectedNote?.id == note.id ? 'selected' : '')}
                                    id={note.id}
                                >
                                    <h3>{note.data.title.length == 0 ? "Пустая заметка" :  truncate(note.data.title, 20)}</h3>
                                    <p></p>
                                    <span className="update-time">{formatDate(note.update_time)}</span>
                                </div>
                            ))
                            :
                            !this.state.fetching ? <h3 className="notes-not-found-label">Список заметок пуст</h3> : ""}
                    </div>
                </aside>
                <NoteEditor open={this.state.editorOpen}
                            setClose={this.closeEditor}
                            onChangeNote={this.onChangeSelectedNoteContent}
                            onChangeTitle={this.onChangeSelectedNoteTitle}
                />
            </div>
        );
    }
}