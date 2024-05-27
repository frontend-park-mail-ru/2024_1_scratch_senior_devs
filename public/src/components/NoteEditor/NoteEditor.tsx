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
import {Tooltip} from "../Tooltip/Tooltip";
import {TagList} from "../TagList/TagList";
import {EditorWrapper} from "../EditorWrapper/EditorWrapper";
import {AppUserStore} from "../../modules/stores/UserStore";
import {Collaborators} from "../Collaborators/Collaborators";
import {EmojiPicker} from "../EmojiPicker/EmojiPicker";
import {BackgroundPicker} from "../BackgroundPicker/BackgroundPicker";
import {NoteType} from "../../utils/types";
import {SharePanel} from "../SharePanel/SharePanel";
import {PluginProps} from "../Editor/Plugin";
import {Dropdown} from "../Dropdown/Dropdown";
import YoutubeDialogForm from "../YoutubeDialog/YoutubeDialog";

type NoteEditorType = {
    selectedNote: NoteType
    noteStatus: string
    deleteNoteModalOpen: boolean
    tagsModalOpen: boolean
    emojiModalOpen: boolean
    backgroundModalOpen: boolean
    fullScreen: boolean
    shareModalOpen: boolean
}

type NoteEditorProps = {
    open: boolean
    setClose: () => void
    onChangeTags: (tags) => void
    onChangeTitle: (title) => void
    onChangeNote: () => void
}

export class NoteEditor extends ScReact.Component<NoteEditorProps, NoteEditorType> {
    state = {
        selectedNote: null,
        noteStatus: null,
        deleteNoteModalOpen: false,
        tagsModalOpen: false,
        emojiModalOpen: false,
        backgroundModalOpen: false,
        shareModalOpen: false,
        fullScreen: false,
        dropdownOpen: false,
        dropdownPos: {
            left: 0,
            top: 0
        },
        youtube: false
    };

    private editorWrapperRef

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

        this.setState(state => ({
            ...state,
            noteStatus: "saved"
        }))
    };

    onChangeNote = () => {
        this.setState(state => ({
            ...state,
            noteStatus: null
        }))
    };

    closeEditor = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_FULLSCREEN)

        // this.saveNote({id: AppNotesStore.state.selectedNote.id, parent: AppNotesStore.state.selectedNote.parent, note: AppNoteStore.state.note});
        this.props.setClose();
        setTimeout(() => AppDispatcher.dispatch(NotesActions.CLOSE_NOTE), 300);
    };

    updateState = (store:NotesStoreState) => {
        if (store.selectedNote != this.state.selectedNote) {
            this.setState(state => ({
                ...state,
                noteStatus: null,
            }));
        }

        this.setState(state => ({
            ...state,
            selectedNote: store.selectedNote,
            fullScreen: store.fullScreen
        }));

        if (store.selectedNoteSynced) {
            this.setState(state => ({
                ...state,
                noteStatus: "sync",
            }));
        }

    };

    openDeleteNoteModal = () => {
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
        AppDispatcher.dispatch(NotesActions.TOGGLE_FAVORITE, this.state.selectedNote)
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

    openShareModal = () => {
        this.setState(state => ({
            ...state,
            shareModalOpen: true
        }))
    }

    closeShareModal = () => {
        this.setState(state => ({
            ...state,
            shareModalOpen: false
        }))
    }

    exportToPDF = () => {
        AppDispatcher.dispatch(NotesActions.EXPORT_TO_PDF, document.querySelector(".note-editor-content").outerHTML)
    }

    exportToZip = () => {
        AppDispatcher.dispatch(NotesActions.EXPORT_TO_ZIP, {
            note_id: this.state.selectedNote.id,
            content: document.querySelector(".note-editor-content").outerHTML
        })
    }

    openDropdown = (elem: HTMLElement) => {
        const editor = this.editorWrapperRef
        const offsetBottom = editor.clientHeight - elem.getBoundingClientRect().top
        const dropdownOffsetTop = offsetBottom < 205 ? -225 : 40

        this.setState(state => ({
            ...state,
            dropdownOpen: true,
            dropdownPos: {
                left: elem.offsetLeft + 20,
                top: elem.offsetTop + dropdownOffsetTop
            }
        }))
    }

    closeDropdown = () => {
        this.setState(state => ({
            ...state,
            dropdownOpen: false
        }))
    }

    openYoutube = (elem: HTMLElement) => {
        this.setState(state => ({
            ...state,
            youtube: true,
        }))
    }

    closeYoutube = () => {
        this.setState(state => ({
            ...state,
            youtube: false
        }))
    }

    render() {
        const isSubNote = this.state.selectedNote?.parent != "00000000-0000-0000-0000-000000000000" ? "hidden" : ""
        const isAuth = AppUserStore.state.isAuth
        const isOwner = this.state.selectedNote?.owner_id == AppUserStore.state.user_id
        const isEditable = this.state.selectedNote?.collaborators.includes(AppUserStore.state.user_id) || isOwner

        // TODO: скелетон для эдитора
        // console.log("render")
        // console.log(this.state.selectedNote)
        //
        // if (!this.state.selectedNote) {
        //     return (
        //         <div>
        //
        //         </div>
        //     )
        // }
        //
        // console.log("123")

        return (
            <div className={'note-editor-wrapper ' + (this.props.open ? ' active ' : '')  + (this.state.fullScreen ? ' fullscreen ' : '') } ref={ref => this.editorWrapperRef = ref}>

                <SwipeArea enable={this.props.open} right={this.closeEditor} target=".note-editor-wrapper"/>

                <Modal open={this.state.deleteNoteModalOpen}
                       handleClose={this.closeDeleteModalDialog}
                       content={<DeleteNoteDialog onSuccess={this.deleteNote} handleClose={this.closeDeleteModalDialog}/>}
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

                <Modal open={this.state.shareModalOpen}
                       handleClose={this.closeShareModal}
                       reset={false}
                       hideTitle={true}
                       content={<SharePanel note={this.state.selectedNote}/>}
                />

                <Modal open={this.state.youtube} content={<YoutubeDialogForm handleClose={this.closeYoutube}/>} handleClose={this.closeYoutube}/>

                <div className="note-background" style={`background: ${this.state.selectedNote?.header};`}>

                </div>

                <div className="top-panel" style={`background: ${this.state.selectedNote?.header};`}>

                    <div className="close-editor-label-wrapper">
                        <div className="close-editor-label-container" onclick={this.closeEditor}>
                            <Img src="left-chevron.svg" className="back-icon"/>
                            <span className="back-label">Заметки</span>
                        </div>
                    </div>

                    <div className={'tag-list-wrapper ' + (isSubNote ? 'hidden' : '')}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon="tag.svg"
                                label="Тэги"
                                content={<TagList tags={this.state.selectedNote?.tags}
                                                  onChange={this.props.onChangeTags}/>}
                            /> : ''
                        }
                    </div>

                    <div className={'emoji-picker-wrapper ' + (isSubNote ? 'hidden' : '')}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon={this.state.selectedNote?.icon ? this.state.selectedNote?.icon : 'emoji.svg'}
                                iconFromUnicode={this.state.selectedNote?.icon}
                                label="Иконка"
                                content={<EmojiPicker icon={this.state.selectedNote?.icon}/>}
                            /> : ''
                        }
                    </div>

                    <div className={'background-picker-wrapper ' + (isSubNote ? 'hidden' : '')}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon="image.svg"
                                label="Шапка"
                                content={<BackgroundPicker/>}
                            /> : ''
                        }
                    </div>

                    <div className={'share-panel-wrapper ' + (isSubNote ? 'hidden' : '')}>
                        {isOwner ?
                            <Tooltip
                                showHoverTooltip={false}
                                icon="link.svg"
                                label="Поделиться"
                                content={<SharePanel note={this.state.selectedNote}/>}
                            /> : ''
                        }
                    </div>

                    <div className="empty">

                    </div>

                    {this.state.noteStatus == 'sync' ?
                        <div
                            className={'note-save-indicator ' + (this.state.noteStatus == 'sync' ? 'active' : 'hidden')}>
                            <Tooltip icon={'sync.svg'}
                                     showHoverTooltip={true}
                                     hoverTooltip={'Синхронизированно'}/>
                        </div>
                        :
                        <div
                            className={'note-save-indicator ' + (this.state.noteStatus == 'saved' ? 'active' : 'hidden')}>
                            <Tooltip icon={'check.svg'}
                                     showHoverTooltip={true}
                                     hoverTooltip={'Сохранено'}/>
                        </div>
                    }

                    {/*<div>*/}
                    {/*    {*/}
                    {/*        this.state.noteStatus == "saved" ?*/}
                    {/*            <div className={"note-save-indicator " + (this.state.noteStatus ? "active" : "")}>*/}
                    {/*                <Tooltip icon={"check.svg"}*/}
                    {/*                         showHoverTooltip={true}*/}
                    {/*                         hoverTooltip={"Сохранено"}/>*/}
                    {/*            </div>*/}
                    {/*            :*/}
                    {/*            ""*/}
                    {/*    }*/}

                    {/*    {*/}
                    {/*        this.state.noteStatus == "sync" ?*/}
                    {/*            <div className={"note-save-indicator " + (this.state.noteStatus ? "active" : "")}>*/}
                    {/*                <Tooltip icon={"sync.svg"}*/}
                    {/*                         showHoverTooltip={true}*/}
                    {/*                         hoverTooltip={"Синхронизированно"}/>*/}
                    {/*            </div>*/}
                    {/*            :*/}
                    {/*            ""*/}
                    {/*    }*/}
                    {/*</div>*/}


                    <div className="collaborators-container">
                        <Collaborators/>
                    </div>

                    <div className={!isAuth || isSubNote ? 'hidden' : ''}>
                        <Tooltip
                            hoverTooltip={this.state.selectedNote?.favorite ? 'Удалить из избранного' : 'В избранное'}
                            showHoverTooltip={true}
                            className="add-to-favorite-btn"
                            icon={this.state.selectedNote?.favorite ? 'star-filled.svg' : 'star.svg'}
                            onClick={this.addToFavoriteBtn}/>
                    </div>

                    <div className={!isSubNote ? 'hidden' : ''}>
                        <Tooltip
                            hoverTooltip="Вернуться"
                            showHoverTooltip={true}
                            icon="arrow-up.svg"
                            onClick={this.openParentNote}
                        />
                    </div>

                    <Tooltip
                        hoverTooltip="Владелец: user91"
                        showHoverTooltip={true}
                        icon="info_circle.svg"
                    />

                    <NoteMenu
                        note={this.state.selectedNote}
                        deleteNote={this.openDeleteNoteModal}
                        openTagList={this.openTagsModal}
                        openEmojiList={this.openEmojiModal}
                        openBackgroundList={this.openBackgroundModal}
                        openSharePanel={this.openShareModal}
                        onExportToPdf={this.exportToPDF}
                        onExportToZip={this.exportToZip}
                    />

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

                    <Tooltip icon="close.svg" showHoverTooltip={true} hoverTooltip="Закрыть"
                             className="close-editor-btn" onClick={this.closeEditor}/>

                </div>

                <div className="bottom-panel">

                    <Dropdown
                        style={`left: ${this.state.dropdownPos.left}px; top: ${this.state.dropdownPos.top}px;`}
                        onClose={this.closeDropdown}
                        open={this.state.dropdownOpen}
                        openYoutubeDialog={this.openYoutube}
                    />

                    <EditorWrapper
                        open={this.state.selectedNote != null}
                        note={this.state.selectedNote}
                        isOwner={isOwner}
                        isEditable={isEditable}
                        openDropdown={this.openDropdown}
                        closeDropdown={this.closeDropdown}
                        onChangeTitle={(value: string) => {
                            this.props.onChangeTitle(value);
                            this.onChangeNote();
                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_TITLE, value)
                            AppDispatcher.dispatch(NotesActions.CHANGE_TITLE, value)
                        }}
                        onChangeContent={(content:PluginProps) => {
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