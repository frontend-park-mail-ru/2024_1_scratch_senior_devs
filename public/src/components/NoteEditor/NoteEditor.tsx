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
import {EmojiPicker} from "../EmojiPicker/EmojiPicker";
import {BackgroundPicker} from "../BackgroundPicker/BackgroundPicker";

export class NoteEditor extends ScReact.Component<any, any> {
    state = {
        selectedNote: undefined,
        content: undefined,
        deleteNoteModalOpen: false,
        inviteUserModalOpen: false,
        tagsModalOpen: false,
        emojiModalOpen: false,
        backgroundModalOpen: false,
        fullScreen: false,
        favourite: false // TODO
    };

    private savingLabelRef;
    private noteEditorHeader

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState);
        AppNoteStore.AddSaver(this.saveNote);
    }

    componentWillUnmount() {
        AppNotesStore.UnSubscribeToStore(this.updateState);
        AppNoteStore.RemoveSavers(() => this.saveNote);
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
        document.getElementById("note-editor-inner").contentEditable = "false"

        AppDispatcher.dispatch(NotesActions.CLOSE_FULLSCREEN)

        // this.saveNote({id: AppNotesStore.state.selectedNote.id, parent: AppNotesStore.state.selectedNote.parent, note: AppNoteStore.state.note});
        this.props.setClose();
        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300);
    };

    updateState = (store:NotesStoreState) => {
        if (store.selectedNote != this.state.selectedNote) {
            this.savingLabelRef.classList.remove("active")
        }

        this.setState(state => ({
            ...state,
            selectedNote: store.selectedNote,
            fullScreen: store.fullScreen
        }));
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

    openFullScreen = () => {
        AppDispatcher.dispatch(NotesActions.OPEN_FULLSCREEN)
    }

    closeFullScreen = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_FULLSCREEN)
    }

    deleteNote = () => {
        AppDispatcher.dispatch(NotesActions.DELETE_NOTE, {
            id: this.state.selectedNote.id
        });
    }

    openTagsModal = () => {
        this.setState(state => ({
            ...state,
            tagsModalOpen: true
        }))
    }

    closeTagsModal = () => {
        this.setState(state => ({
            ...state,
            tagsModalOpen: false
        }))
    }

    openEmojiModal = () => {
        this.setState(state => ({
            ...state,
            emojiModalOpen: true
        }))
    }

    closeEmojiModal = () => {
        this.setState(state => ({
            ...state,
            emojiModalOpen: false
        }))
    }

    openBackgroundModal = () => {
        this.setState(state => ({
            ...state,
            backgroundModalOpen: true
        }))
    }

    closeBackgroundModal = () => {
        this.setState(state => ({
            ...state,
            backgroundModalOpen: false
        }))
    }

    render() {
        const isSubNote = this.state.selectedNote?.parent != "00000000-0000-0000-0000-000000000000" ? "hidden" : ""
        const isOwner = this.state.selectedNote?.owner_id == AppUserStore.state.user_id

        return (
            <div className={'note-editor-wrapper ' + (this.props.open ? ' active ' : '')  + (this.state.fullScreen ? ' fullscreen ' : '') }>

                <SwipeArea enable={this.props.open} right={this.closeEditor} target=".note-editor-wrapper"/>

                <Modal open={this.state.deleteNoteModalOpen}
                       handleClose={this.closeDeleteModalDialog}
                       content={<DeleteNoteDialog onSuccess={this.deleteNote} handleClose={this.closeDeleteModalDialog}/>}
                />

                <Modal open={this.state.inviteUserModalOpen}
                       handleClose={this.closeInviteUserModal}
                       content={<InviteUserModal handleClose={this.closeInviteUserModal} open={this.state.inviteUserModalOpen}/>}
                />

                <Modal open={this.state.tagsModalOpen}
                       handleClose={this.closeTagsModal}
                       reset={false}
                       title="Изменить тэги"
                       content={<TagList tags={this.state.selectedNote?.tags} onChange={this.props.onChangeTags} />}
                />

                <Modal open={this.state.emojiModalOpen}
                       handleClose={this.closeEmojiModal}
                       reset={false}
                       title="Изменить иконку"
                       content={<EmojiPicker icon={this.state.selectedNote?.icon} />}
                />

                <Modal open={this.state.backgroundModalOpen}
                       handleClose={this.closeBackgroundModal}
                       reset={false}
                       title="Изменить шапку"
                       content={<BackgroundPicker />}
                />

                <div className="note-background" ref={ref => this.noteEditorHeader = ref} style={`background: ${this.state.selectedNote?.header};`}>

                </div>

                <div className="top-panel" >

                    <div className="close-editor-label-wrapper">
                        <div className="close-editor-label-container" onclick={this.closeEditor}>
                            <Img src="left-chevron.svg" className="back-icon"/>
                            <span className="back-label">Заметки</span>
                        </div>
                    </div>

                    <div className={"tag-list-wrapper " + (isSubNote ? "hidden" : "")}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon="tag.svg"
                                label="Тэги"
                                content={<TagList tags={this.state.selectedNote?.tags} onChange={this.props.onChangeTags} />}
                            /> : ""
                        }
                    </div>

                    <div className={"emoji-picker-wrapper " + (isSubNote ? "hidden" : "")}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon={this.state.selectedNote?.icon ? this.state.selectedNote?.icon : "emoji.svg"}
                                iconFromUnicode={this.state.selectedNote?.icon}
                                label="Иконка"
                                content={<EmojiPicker icon={this.state.selectedNote?.icon} />}
                            /> : ""
                        }
                    </div>

                    <div className={"background-picker-wrapper " + (isSubNote ? "hidden" : "")}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon="image.svg"
                                label="Шапка"
                                content={<BackgroundPicker />}
                            /> : ""
                        }
                    </div>

                    <div className="empty">

                    </div>

                    <div className="note-save-indicator" ref={ref => this.savingLabelRef = ref}>
                        <Tooltip icon="check.svg" showHoverTooltip={true} hoverTooltip="Сохранено"/>
                    </div>

                    <div className="collaborators-container">
                        <Collaborators/>
                    </div>

                    <div className={isSubNote ? "hidden" : ""}>
                        <Tooltip hoverTooltip={this.state.favourite ? "Удалить из избранного" : "В избранное"}
                                 showHoverTooltip={true}
                                 className="add-to-favorite-btn"
                                 icon={this.state.favourite ? "star-filled.svg" : "star.svg"}
                                 onClick={this.addToFavoriteBtn}/>
                    </div>

                    <div className={!isSubNote ? "hidden" : ""}>
                        <Tooltip
                            hoverTooltip="Вернуться"
                            showHoverTooltip={true}
                            icon="arrow-up.svg"
                            onClick={this.openParentNote}
                        />
                    </div>

                    {isOwner ?
                        <NoteMenu
                            note={this.state.selectedNote}
                            deleteNote={this.openDeleteNoteModal}
                            inviteUser={this.openInviteUserModal}
                            openTagList={this.openTagsModal}
                            openEmojiList={this.openEmojiModal}
                            openBackgroundList={this.openBackgroundModal}
                        /> : ""
                    }

                    {!this.state.fullScreen ?
                        <Tooltip
                            icon="full-screen-open.svg"
                            hoverTooltip="На весь экран"
                            showHoverTooltip={true}
                            className="toggle-fullscreen-btn"
                            onClick={this.openFullScreen}/>
                        :
                        <Tooltip
                            icon="full-screen-close.svg"
                            showHoverTooltip={true}
                            hoverTooltip="Уменьшить"
                            className="toggle-fullscreen-btn"
                            onClick={this.closeFullScreen}/>
                    }

                    <Tooltip icon="close.svg" showHoverTooltip={true} hoverTooltip="Закрыть" className="close-editor-btn" onClick={this.closeEditor}/>

                </div>

                <div className="bottom-panel">

                    <EditorWrapper
                        open={this.state.selectedNote != null}
                        onChangeTitle={(value: string) => {
                            this.props.onChangeTitle(value);
                            this.onChangeNote();
                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_TITLE, value)
                            AppDispatcher.dispatch(NotesActions.CHANGE_TITLE, value)
                        }}
                        onChangeContent={(content) => {
                            this.props.onChangeNote()
                            this.onChangeNote()
                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_CONTENT, content)
                            AppDispatcher.dispatch(NotesActions.CHANGE_CONTENT, content)
                        }}
                    />

                </div>
            </div>
        );
    }
}