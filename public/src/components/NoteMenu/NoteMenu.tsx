import {ScReact} from "@veglem/screact";
import "./NoteMenu.sass"
import {Img} from "../Image/Image";
import {AppNotesStore} from "../../modules/stores/NotesStore";
import {isSubNote} from "../../modules/utils";

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

    inviteUser = () => {
        this.toggleMenu()
        this.props.inviteUser()
    }

    render() {
        return (
            <div className={"note-menu " + (this.state.open ? "open" : "")}>
                <div className="dots-wrapper" onclick={this.toggleMenu} ref={ref => this.dotsRef = ref}>
                    <div className="dots">
                        <div className="click-element"></div>
                    </div>
                </div>
                <div className="options" ref={ref => this.noteMenuRef = ref}>
                    {!isSubNote(AppNotesStore.state.selectedNote) ?
                        <div className="options-item" onclick={this.inviteUser}>
                            <Img src="invite.png" className="icon"/>
                            <span>Пригласить людей</span>
                        </div> : ""}
                    <div className="options-item">
                        <Img src="share.svg" className="icon"/>
                        <span>Поделиться заметкой</span>
                    </div>
                    <div className="options-item" onclick={this.deleteNote}>
                        <Img src="trash.svg" className="icon"/>
                        <span>Удалить заметку</span>
                    </div>
                    <div className="options-item">
                        <Img src="pdf.svg" className="icon"/>
                        <span>Скачать в pdf</span>
                    </div>
                    <div className="options-item mobile-option">
                        <Img src={this.props.note.favourite ? "star-filled.svg" : "star.svg"} className="icon"/>
                        <span>{this.props.note.favourite ? "Удалить из избранного" : "В избранное"}</span>
                    </div>
                    <div className="options-item mobile-option">
                        <Img src="tag.svg" className="icon"/>
                        <span>Изменить тэги</span>
                    </div>
                    <div className="options-item mobile-option">
                        <Img src="emoji.svg" className="icon"/>
                        <span>Изменить иконку</span>
                    </div>
                    <div className="options-item mobile-option">
                        <Img src="image.svg" className="icon"/>
                        <span>Изменить шапку</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default NoteMenu