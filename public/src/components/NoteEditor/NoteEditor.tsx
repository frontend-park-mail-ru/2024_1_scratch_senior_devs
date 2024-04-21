import {ScReact} from '@veglem/screact';
import './NoteEditor.sass';
import {Img} from '../Image/Image';
import {AppNotesStore, NotesActions, NotesStoreState} from '../../modules/stores/NotesStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {SwipeArea} from '../SwipeArea/SwipeArea';
import {Editor} from '../Editor/Editor';
import {AppNoteStore} from '../../modules/stores/NoteStore';
import {Modal} from '../Modal/Modal';
import {DeleteNoteDialog} from '../DeleteNoteDialog/DeleteNoteDialog';

export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        selectedNote: undefined,
        content: undefined,
        deleteNoteModalOpen: false
    };

    private savingLabelRef;

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState);
        AppNoteStore.AddSaver(this.saveNote);
    }

    saveNote = () => {
        if (this.state.selectedNote) {
            AppDispatcher.dispatch(NotesActions.SAVE_NOTE,  {
                id: this.state.selectedNote.id,
                note: AppNoteStore.state.note
            });
        }

        this.savingLabelRef.innerHTML = window.navigator.onLine ? 'Сохранено' : 'Не удалось сохранить';
        this.savingLabelRef.style.opacity = 1;
    };

    onChangeNote = () => {
        this.savingLabelRef.innerHTML = '';
        this.savingLabelRef.style.opacity = 0;
    };

    closeEditor = () => {
        this.saveNote();
        this.props.setClose();
        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300);
    };

    updateState = (store:NotesStoreState) => {
        console.log('NoteEditor.updateState');

        if (store.selectedNote != this.state.selectedNote) {
            this.savingLabelRef.innerHTML = '';
        }

        this.setState(state => {
            return {
                ...state,
                selectedNote: store.selectedNote
            };
        });

        if (this.state.selectedNote) {
            AppNoteStore.SetNote({
                title: this.state.selectedNote.data.title,
                blocks: this.state.selectedNote.data.content
            });
        }
    };

    deleteNote = () => {
        this.setState(state => ({
            ...state,
            deleteNoteModalOpen: true
        }))
    };

    closeDeleteModalDialog = () => {
        this.setState(state => ({
            ...state,
            deleteNoteModalOpen: false
        }))
    }

    render() {
        return (
            <div className={'note-editor ' + (this.props.open ? 'active' : '')}>

                <SwipeArea enable={this.props.open} right={this.closeEditor} target=".note-editor-wrapper"/>

                <Modal open={this.state.deleteNoteModalOpen} handleClose={this.closeDeleteModalDialog} content={<DeleteNoteDialog handleClose={this.closeDeleteModalDialog} />} />

                <div className="top-panel">
                    <div className="left-container">
                        <div className="close-editor" onclick={this.closeEditor}>
                            <Img src="left-chevron.svg" className="close-editor__icon"/>
                            <span className="close-editor_label">Заметки</span>
                        </div>
                    </div>
                    <div className="right-container">
                        <div className="note-save-indicator">
                            <span ref={ref => this.savingLabelRef = ref}></span>
                        </div>
                        <Img src="trash.svg" className="right-container__icon right-container__icon-delete" onClick={this.deleteNote}/>
                        <Img src="close.svg" className="right-container__icon right-container__icon-close" onClick={this.closeEditor}/>
                    </div>
                </div>

                <div className="bottom-panel">

                    <Editor
                        onChangeTitle={(value:string) => {
                            console.log('onChangeTitle');
                            this.props.onChangeTitle(value);
                            this.onChangeNote();
                        }}
                        onChangeContent={() => {
                            this.props.onChangeNote()
                            this.onChangeNote()
                        }}
                    />

                </div>
            </div>
        );
    }
}