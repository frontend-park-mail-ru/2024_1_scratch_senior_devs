import {ScReact} from '@veglem/screact';
import './style.sass';
import SearchBar from '../../components/SearchBar/SearchBar';
import {NoteEditor} from '../../components/NoteEditor/NoteEditor';
import {AppNotesStore, NotesActions, NotesStoreState} from '../../modules/stores/NotesStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {Button} from '../../components/Button/Button';
import {Img} from '../../components/Image/Image';
import {AppNoteStore} from '../../modules/stores/NoteStore';
import {Loader} from '../../components/Loader/Loader';
import {parseNoteTitle, scrollToTop, truncate, unicodeToChar} from '../../modules/utils';
import {Note} from "../../components/Note/Note";
import {TagsFilter} from "../../components/TagsFilter/TagsFilter";

export class NotesPage extends ScReact.Component<any, any> {
    state = {
        notes: [],
        selectedNote: undefined,
        tags: [],
        selectedTags: [],
        editorOpen: false,
        fetching: false,
        query: "",
        fullScreen: false
    };

    private notesContainerRef

    componentDidMount() {
        document.title = 'Заметки';

        scrollToTop()

        AppNotesStore.SubscribeToStore(this.updateState);

        // AppNoteStore.AddSaver(this.updateNotesTitles);

        this.setState(state => ({
            ...state,
            tags: this.props.tags,
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
                    notes[index].data.title = parseNoteTitle(AppNoteStore.state.note.title);
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
        document.body.classList.remove('locked');
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => {
            if (state.notes.length > 0 && state.notes.length < store.notes.length) {
                this.createObserver();
            }

            if (store.selectedNote) {
                document.title = parseNoteTitle(store.selectedNote.data.title);

                if (this.state.selectedNote) {
                    // this.updatePreviewNoteTitle(store.selectedNote.data.title)
                }
            }

            return {
                ...state,
                selectedNote: store.selectedNote,
                tags: store.tags,
                editorOpen: store.selectedNote != undefined,
                notes: store.notes,
                fetching: store.fetching,
                fullScreen: store.fullScreen
            };
        });
    };

    handleSelectNote = (e) => {
        let id = undefined;

        if (e.target.matches('.note-container')) {
            id = e.target.id;
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

    createNewNote = () => {
        AppDispatcher.dispatch(NotesActions.CREATE_NEW_NOTE, true);
    };

    onSearchBarStartTyping = () => {
        AppDispatcher.dispatch(NotesActions.START_FETCHING)
    }

    onChangeSelectedNoteTitle = (title:string) => {
        this.updatePreviewNoteTitle(title)
        this.updateNotesTitles()
    };

    updatePreviewNoteTitle = (title:string) => {
        const selectedNote = document.getElementById(this.state.selectedNote.id);

        if (selectedNote) {
            const noteTitle = selectedNote.querySelector('h3');
            noteTitle.innerHTML = title.length > 0 ? truncate(title, 20) : "Пустая заметка";
            document.title = noteTitle.innerHTML
        }
    }

    updatePreviewNoteIcon = (icon:string) => {
        const selectedNote = document.getElementById(this.state.selectedNote.id);

        if (selectedNote) {
            const noteEmoji = selectedNote.querySelector('.note-icon');
            noteEmoji.innerHTML = icon ? unicodeToChar(icon) : ""
            AppDispatcher.dispatch(NotesActions.UPDATE_NOTE_ICON, icon)
        }
    }

    onChangeSelectedNoteBackground = (background:string) => {

    }

    onChangeSelectedNoteContent = () => {
        this.updateNotesTitles()
    }

    onChangeTags = (tags:string[]) => {
        AppNotesStore.state.selectedNote.tags = tags
        AppDispatcher.dispatch(NotesActions.SYNC_NOTES)
    }

    selectTag = (tag:string) => {
        if (this.state.selectedTags.includes(tag)) {
            this.setState(state => ({
                ...state,
                selectedTags: state.selectedTags.filter(t => t != tag)
            }))
        } else {
            this.setState(state => ({
                ...state,
                selectedTags: [...state.selectedTags, tag]
            }))
        }

        this.searchNotes()
    }

    onSearchBarChange = (value:string) => {
        this.setState(state => ({
            ...state,
            query: value
        }))

        this.searchNotes()
    }

    searchNotes = () => {
        AppDispatcher.dispatch(NotesActions.SEARCH_NOTES, {
            query: this.state.query,
            selectedTags: this.state.selectedTags
        })
    }

    render() {
        return (
            <div className={'notes-page-wrapper ' + (this.state.editorOpen ? ' active ' : '') + (this.state.fullScreen ? ' fullscreen ' : '')} >
                <aside>
                    <div className="top-panel">
                        <SearchBar onStartTyping={this.onSearchBarStartTyping} onChange={this.onSearchBarChange}/>
                        <div className="add-note-btn-container" onclick={this.createNewNote}>
                            <Button label="Новая заметка" className="add-note-btn"/>
                            <div className="add-note-icon-wrapper">
                                <Img src="plus.svg" className="add-note-icon"/>
                            </div>
                        </div>
                    </div>
                    {this.state.tags.length > 0 ? <TagsFilter tags={this.state.tags} selectedTags={this.state.selectedTags} selectTag={this.selectTag} /> : "" }
                    <div className="notes-container" onclick={this.handleSelectNote} ref={ref => this.notesContainerRef = ref}>
                        <Loader active={this.state.fetching}/>
                        {
                            this.state.notes.length > 0 ?
                                this.state.notes.map(note => (
                                    <Note selected={this.state.selectedNote?.id == note.id} note={note}/>
                                ))
                                :
                                !this.state.fetching ?
                                    <h3 className="notes-not-found-label">Список заметок пуст</h3> : ""
                        }
                    </div>
                </aside>

                <NoteEditor open={this.state.editorOpen}
                            setClose={this.closeEditor}
                            onChangeNote={this.onChangeSelectedNoteContent}
                            onChangeTitle={this.onChangeSelectedNoteTitle}
                            onChangeTags={this.onChangeTags}
                            onChangeIcon={this.updatePreviewNoteIcon}
                            onChangeBackground={this.onChangeSelectedNoteBackground}
                />

            </div>
        );
    }
}