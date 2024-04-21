import {ScReact} from '@veglem/screact';
import './style.sass';
import {SearchBar} from '../../components/SearchBar/SearchBar';
import {NoteEditor} from '../../components/NoteEditor/NoteEditor';
import {AppNotesStore, NotesActions, NotesStoreState} from '../../modules/stores/NotesStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {Button} from '../../components/Button/Button';
import {Img} from '../../components/Image/Image';
import {AppNoteStore} from '../../modules/stores/NoteStore';
import {Loader} from '../../components/Loader/Loader';
import {formatDate, scrollToTop, truncate} from '../../modules/utils';

export class NotesPage extends ScReact.Component<any, any> {
    state = {
        notes: [],
        selectedNote: undefined,
        editorOpen: false,
        fetching: false
    };

    componentDidMount() {
        document.title = 'Заметки';

        scrollToTop()

        AppNotesStore.SubscribeToStore(this.updateState);

        // AppNoteStore.AddSaver(this.updateNotesTitles);

        console.log("NotesPage.componentDidMount")
        console.log(this.props.notes)

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

        if (this.props.notes.length > 10) {
            this.createObserver();
        }
    }

    updateNotesTitles = () => {
        console.log('updateNotesTitles');
        setTimeout(()=> {
            console.log(AppNoteStore.state.note);
            const notes = AppNotesStore.state.notes;
            notes.forEach((note, index) => {
                if (note.id == this.state.selectedNote?.id) {
                    console.log('Yeeees');
                    notes[index].data.title = AppNoteStore.state.note.title == "" ? "Пустая заметка" : AppNoteStore.state.note.title;
                    notes[index].update_time = new Date()
                    console.log(notes);
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
        console.log("index.updateState")
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

            AppDispatcher.dispatch(NotesActions.FETCH_NOTE, id);

            history.pushState(null, null, "/notes/" + id)
        }
    };

    closeEditor = () => {
        console.log("closeEditor")
        console.log(1)
        
        this.setState(state => ({
            ...state,
            editorOpen: false
        }));

        console.log(2)

        document.title = 'Заметки';
        console.log(3)

        history.pushState(null, null, '/notes');
        console.log(4)

        document.body.classList.remove('locked');
    };

    createObserver() {
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

        const lastNote = document.querySelector('.note-container:last-child');
        lastNote && observer.observe(lastNote);
    }

    searchNotes = (value:string) => {
        AppDispatcher.dispatch(NotesActions.SEARCH_NOTES, value);
    };

    createNewNote = () => {
        AppDispatcher.dispatch(NotesActions.CREATE_NEW_NOTE);
    };

    // private noteRefs = {};
    //
    // saveSelectedNoteRef = (note, ref) => {
    //     this.noteRefs[note.id] = ref;
    // };

    onChangeSelectedNoteTitle = (title:string) => {
        console.log('onChangeSelectedNoteTitle');
        console.log(title)

        // TODO: только что созданная заметка == null
        // const selectedNote = this.noteRefs[this.state.selectedNote.id];

        const selectedNote = document.getElementById(this.state.selectedNote.id);

        if (selectedNote) {
            const noteTitle = selectedNote.querySelector('h3');
            noteTitle.innerHTML = title.length > 0 ? truncate(title, 20) : "Пустая заметка";
            document.title = noteTitle.innerHTML
            console.log(noteTitle.innerHTML)
        }

        this.updateNotesTitles()
    };

    onChangeSelectedNoteContent = () => {
        this.updateNotesTitles()
    }

    render() {
        console.log("render")

        return (
            <div className={'notes-page-wrapper ' + (this.state.editorOpen ? 'active' : '')} >
                <aside>
                    <div className="top-panel">
                        <SearchBar onChange={this.searchNotes} />
                        <div className="add-note-btn-container" onclick={this.createNewNote}>
                            <Button label="Новая заметка" className="add-note-btn" />
                            <div className="add-note-icon-wrapper">
                                <Img src="plus.svg" className="add-note-icon" />
                            </div>
                        </div>
                    </div>
                    <div className="notes-container" onclick={this.handleSelectNote}>
                        <Loader active={this.state.fetching}/>
                        {
                            this.state.notes.length > 0 ?
                                this.state.notes.map(note => (
                                <div
                                    className={'note-container ' + (this.state.selectedNote?.id == note.id ? 'selected' : '')}
                                    id={note.id}
                                    // ref={ref => this.saveSelectedNoteRef(note, ref)}
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