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
import NoteMenu from "../NoteMenu/NoteMenu";
import {InviteUserModal} from "../InviteUserModal/InviteUserModal";
import {Tooltip} from "../Tooltip/Tooltip";
import {AppToasts} from "../../modules/toasts";
import {TagList} from "../TagList/TagList";

export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        selectedNote: undefined,
        content: undefined,
        deleteNoteModalOpen: false,
        inviteUserModalOpen: false,
        favourite: false // TODO
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
                note: AppNoteStore.state.note,
                parent: this.state.selectedNote.data.parent
            });
        }

        this.savingLabelRef.classList.add("active");
    };

    onChangeNote = () => {
        this.savingLabelRef.classList.remove("active")
    };

    closeEditor = () => {
        this.saveNote();
        this.props.setClose();
        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300);
    };

    updateState = (store:NotesStoreState) => {
        if (store.selectedNote != this.state.selectedNote) {
            this.savingLabelRef.classList.remove("active")
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

    openDeleteNoteModal = () => {
        this.setState(state => ({
            ...state,
            deleteNoteModalOpen: true
        }))
    };

    openInviteUserModal = () => {
        this.setState(state => ({
            ...state,
            inviteUserModalOpen: true
        }))
    };

    closeDeleteModalDialog = () => {
        this.setState(state => ({
            ...state,
            deleteNoteModalOpen: false
        }))
    }

    closeInviteUserModal = () => {
        this.setState(state => ({
            ...state,
            inviteUserModalOpen: false
        }))
    }

    openParentNote = () => {
        AppDispatcher.dispatch(NotesActions.OPEN_NOTE, this.state.selectedNote.parent)
    }

    addToFavoriteBtn = () => {
        // TODO
        console.log("addToFavoriteBtn")
        AppToasts.success("Заметка добавлена в избранное")
        this.setState(state => ({
            ...state,
            favourite: !state.favourite
        }))
    }

    render() {
        const isSubNote = this.state.selectedNote?.parent != "00000000-0000-0000-0000-000000000000" ? "hidden" : ""

        return (
            <div className={'note-editor-wrapper ' + (this.props.open ? 'active' : '')}>

                <SwipeArea enable={this.props.open} right={this.closeEditor} target=".note-editor-wrapper"/>

                <Modal open={this.state.deleteNoteModalOpen}
                       handleClose={this.closeDeleteModalDialog}
                       content={<DeleteNoteDialog handleClose={this.closeDeleteModalDialog}/>}
                />

                <Modal open={this.state.inviteUserModalOpen}
                       handleClose={this.closeInviteUserModal}
                       content={<InviteUserModal handleClose={this.closeInviteUserModal} open={this.state.inviteUserModalOpen}/>}
                />

                <div className="top-panel">
                    <div className="left-container">
                        <div className="close-editor-label-container" onclick={this.closeEditor}>
                            <Img src="left-chevron.svg" className="back-icon"/>
                            <span className="back-label">Заметки</span>
                        </div>
                        <div className={isSubNote ? "hidden" : ""}>
                            <TagList onAddTag={this.props.onAddTag}/>
                        </div>
                    </div>
                    <div className="right-container">

                        {/*{this.state.selectedNote?.data.parent ?*/}
                        {/*    <div className="back-to-parent-note-btn-container" onclick={this.openParentIcon}>*/}
                        {/*        <Img src="arrow-up.svg" className="back-to-parent-note-btn" o/>*/}
                        {/*    </div> : ""*/}
                        {/*}*/}

                        <div className="note-save-indicator" ref={ref => this.savingLabelRef = ref}>
                            <Tooltip icon="check.svg" label="Сохранено"/>
                        </div>

                        <div className={isSubNote ? "hidden" : ""}>
                            <Tooltip label="В избранное" icon={this.state.favourite ? "star-filled.svg" : "star.svg"} onClick={this.addToFavoriteBtn}/>
                        </div>

                        <div className={!isSubNote ? "hidden" : ""}>
                            <Tooltip label="Вернуться" icon="arrow-up.svg" onClick={this.openParentNote}/>
                        </div>

                        <NoteMenu deleteNote={this.openDeleteNoteModal} inviteUser={this.openInviteUserModal}/>

                        <div className="close-editor-btn-container" onclick={this.closeEditor}>
                            <Img src="close.svg" className="icon close-editor-icon"/>
                        </div>
                    </div>
                </div>

                <div className="bottom-panel">

                    <Editor
                        onChangeTitle={(value: string) => {
                            this.props.onChangeTitle(value);
                            this.onChangeNote();
                        }}
                        onChangeContent={() => {
                            console.log("onChangeContent")
                            this.props.onChangeNote()
                            this.onChangeNote()
                        }}
                    />


                </div>
            </div>
        );
    }
}