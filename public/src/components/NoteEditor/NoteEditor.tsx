import {ScReact} from '@veglem/screact';
import './NoteEditor.sass';
import {Img} from '../Image/Image';
import {AppNotesStore, NotesActions, NotesStoreState} from '../../modules/stores/NotesStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {SwipeArea} from '../SwipeArea/SwipeArea';
import {AppNoteStore, NoteStoreActions} from '../../modules/stores/NoteStore';
import {Modal} from '../Modal/Modal';
import {DeleteNoteDialog} from '../DeleteNoteDialog/DeleteNoteDialog';
import NoteMenu from "../NoteMenu/NoteMenu";
import {InviteUserModal} from "../InviteUserModal/InviteUserModal";
import {Tooltip} from "../Tooltip/Tooltip";
import {AppToasts} from "../../modules/toasts";
import {TagList} from "../TagList/TagList";
import {EditorWrapper} from "../Editor/EditorWrapper";
import {AppUserStore} from "../../modules/stores/UserStore";
import {Collaborators} from "../Collaborators/Collaborators";

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

    saveNote = (data) => {
        if (this.state.selectedNote) {
            AppDispatcher.dispatch(NotesActions.SAVE_NOTE, data);
        }

        this.savingLabelRef.classList.add("active");
    };

    onChangeNote = () => {
        this.savingLabelRef.classList.remove("active")
    };

    closeEditor = () => {
        this.saveNote({id: AppNotesStore.state.selectedNote.id, parent: AppNotesStore.state.selectedNote.parent, note: AppNoteStore.state.note});
        this.props.setClose();
        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300);
    };

    updateState = (store:NotesStoreState) => {
        if (store.selectedNote != this.state.selectedNote) {
            this.savingLabelRef.classList.remove("active")
        }

        this.setState(state => ({
            ...state,
            selectedNote: store.selectedNote
        }));

        if (this.state.selectedNote) {
            AppDispatcher.dispatch(NoteStoreActions.SET_NOTE, {
                title: this.state.selectedNote.data.title,
                blocks: this.state.selectedNote.data.content
            })
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
        // TODO: 4 модуль
        
        AppToasts.success("Заметка добавлена в избранное")
        this.setState(state => ({
            ...state,
            favourite: !state.favourite
        }))
    }

    render() {
        const isSubNote = this.state.selectedNote?.parent != "00000000-0000-0000-0000-000000000000" ? "hidden" : ""
        const isOwner = this.state.selectedNote?.owner_id == AppUserStore.state.user_id

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

                    <div className="close-editor-label-wrapper">
                        <div className="close-editor-label-container" onclick={this.closeEditor}>
                            <Img src="left-chevron.svg" className="back-icon"/>
                            <span className="back-label" >Заметки</span>
                        </div>
                    </div>

                    <div className={isSubNote ? "tag-list-wrapper hidden" : "tag-list-wrapper"}>
                        {isOwner ?
                            <TagList tags={this.state.selectedNote?.tags} onChange={this.props.onChangeTags}/> : ""}
                    </div>

                    <div className="note-save-indicator" ref={ref => this.savingLabelRef = ref}>
                        <Tooltip icon="check.svg" label="Сохранено"/>
                    </div>

                    <Collaborators />

                    {/*<div className={isSubNote ? "hidden" : ""}>*/}
                    {/*    <Tooltip label="В избранное" icon={this.state.favourite ? "star-filled.svg" : "star.svg"} onClick={this.addToFavoriteBtn}/>*/}
                    {/*</div>*/}

                    <div className={!isSubNote ? "hidden" : ""}>
                        <Tooltip label="Вернуться" icon="arrow-up.svg" onClick={this.openParentNote}/>
                    </div>

                    {isOwner ? <NoteMenu deleteNote={this.openDeleteNoteModal}
                                         inviteUser={this.openInviteUserModal}/> : ""}

                    <div className="close-editor-btn-container" onclick={this.closeEditor}>
                        <Img src="close.svg" className="icon close-editor-icon"/>
                    </div>

                </div>

                <div className="bottom-panel">

                    <EditorWrapper
                        onChangeTitle={(value: string) => {
                            this.props.onChangeTitle(value);
                            this.onChangeNote();
                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_TITLE, value)
                        }}
                        onChangeContent={(content) => {
                            this.props.onChangeNote()
                            this.onChangeNote()
                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_CONTENT, content)
                        }}
                    />

                </div>
            </div>
        );
    }
}