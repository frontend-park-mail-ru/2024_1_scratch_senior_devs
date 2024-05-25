import {ScReact} from "@veglem/screact";
import "./NoteMenu.sass"
import {Img} from "../Image/Image";
import {AppNotesStore, NotesActions} from "../../modules/stores/NotesStore";
import {isSubNote} from "../../modules/utils";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppUserStore} from "../../modules/stores/UserStore";

export class NoteMenu extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private dotsRef
    private noteMenuRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.dotsRef.contains(e.target) && !this.noteMenuRef.contains(e.target)) {
            this.toggleMenu();
        }
    }

    toggleMenu = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    deleteNote = () => {
        this.toggleMenu()
        this.props.deleteNote()
    }

    tagList = () => {
        this.toggleMenu()
        this.props.openTagList()
    }

    emojiList = () => {
        this.toggleMenu()
        this.props.openEmojiList()
    }

    backgroundList = () => {
        this.toggleMenu()
        this.props.openBackgroundList()
    }

    exportToPdf = () => {
        this.toggleMenu()
        this.props.onExportToPdf()
    }

    exportToZip = () => {
        this.toggleMenu()
        this.props.onExportToZip()
    }

    sharePanel = () => {
        this.toggleMenu()
        this.props.openSharePanel()
    }

    toggleFavorite = () => {
        AppDispatcher.dispatch(NotesActions.TOGGLE_FAVORITE, this.props.note)
    }

    render() {
        const isOwner = this.props.note?.owner_id == AppUserStore.state.user_id
        const isAuth = AppUserStore.state.isAuth

        return (
            <div className={"note-menu " + (this.state.open ? "open" : "")}>
                <div className="dots-wrapper" onclick={this.toggleMenu} ref={ref => this.dotsRef = ref}>
                    <div className="dots">
                        <div className="click-element"></div>
                    </div>
                </div>
                <div className="options" ref={ref => this.noteMenuRef = ref}>

                    <div className="options-item" onclick={this.exportToPdf}>
                        <Img src="pdf.svg" className="icon"/>
                        <span>Скачать в pdf</span>
                    </div>

                    {isOwner ?
                        <div className="options-item" onclick={this.exportToZip}>
                            <Img src="zip.svg" className="icon"/>
                            <span>Скачать в zip</span>
                        </div> : ""
                    }

                    {isOwner ?
                        <div className="options-item mobile-option" onclick={this.sharePanel}>
                            <Img src="link.svg" className="icon"/>
                            <span>Поделиться</span>
                        </div> : ""
                    }

                    {isAuth ?
                        <div className="options-item mobile-option" onclick={this.toggleFavorite}>
                            <Img src={this.props.note?.favorite ? "star-filled.svg" : "star.svg"} className="icon"/>
                            <span>{this.props.note?.favorite ? "Удалить из избранного" : "В избранное"}</span>
                        </div> : ""
                    }

                    {isOwner ?
                        <div className="options-item mobile-option" onclick={this.tagList}>
                            <Img src="tag.svg" className="icon"/>
                            <span>Изменить тэги</span>
                        </div> : ""
                    }

                    {isOwner ?
                        <div className="options-item mobile-option" onclick={this.emojiList}>
                            <Img src="emoji.svg" className="icon"/>
                            <span>Изменить иконку</span>
                        </div> : ""
                    }

                    {isOwner ?
                        <div className="options-item mobile-option" onclick={this.backgroundList}>
                            <Img src="image.svg" className="icon"/>
                            <span>Изменить шапку</span>
                        </div> : ""
                    }

                    {isOwner ?
                        <div className="options-item" onclick={this.deleteNote}>
                            <Img src="trash.svg" className="icon"/>
                            <span>Удалить заметку</span>
                        </div> : ""
                    }

                </div>
            </div>
        )
    }
}

export default NoteMenu