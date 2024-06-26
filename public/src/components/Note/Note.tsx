import {ScReact} from '@veglem/screact';
import './Note.sass';
import {formatDate, parseNoteTitle, truncate, unicodeToChar} from "../../modules/utils";
import {NoteType} from "../../utils/types";
import {Img} from "../Image/Image";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import {AppUserStore} from '../../modules/stores/UserStore';

const MAX_NOTE_CONTENT_PREVIEW_LENGTH = 20;
const MAX_TAGS_PREVIEW_COUNT = 2;

type NoteProps = {
    note: NoteType,
    selected: boolean
}

export class Note extends ScReact.Component<NoteProps, any> {
    private tagsContainerRef

    componentDidMount() {
        this.renderTags()
    }

    componentDidUpdate() {
       this.renderTags()
    }

    renderTags = () => {
        this.tagsContainerRef.innerHTML = ""

        this.props.note.tags.slice(0, MAX_TAGS_PREVIEW_COUNT).forEach(tag => {
            const tagElement = document.createElement("span")
            tagElement.className = "note-tag"
            tagElement.innerText = tag

            this.tagsContainerRef.appendChild(tagElement)
        })

        if (this.props.note.tags.length > MAX_TAGS_PREVIEW_COUNT) {
            const span = document.createElement("span")
            span.className = "note-tag"
            span.textContent = `+${this.props.note.tags.length - MAX_TAGS_PREVIEW_COUNT}`
            this.tagsContainerRef.appendChild(span)
        }
    }

    toggleFavorite = () => {
        AppDispatcher.dispatch(NotesActions.TOGGLE_FAVORITE, this.props.note)
    }

    render() {
        const isOwner = this.props.note.owner_id == AppUserStore.state.user_id

        return (
            <div className={'note-container ' + (this.props.selected ? 'selected ' : '') + (!isOwner ? " collaborator" : "")} id={this.props.note.id} style={`background: ${this.props.note.header};`}>
                <div className="note-title__container">
                    <span className="note-icon">{this.props.note.icon ? unicodeToChar(this.props.note.icon) : ""}</span>
                    <h3 className="note-title">{truncate(parseNoteTitle(this.props.note.data.title), MAX_NOTE_CONTENT_PREVIEW_LENGTH)}</h3>
                </div>
                <div className="note-tags-container" ref={ref => this.tagsContainerRef = ref}></div>
                <span className="update-time">{formatDate(this.props.note.update_time)}</span>

                <Img src={this.props.note.favorite ? "star-filled.svg" : "star.svg"} className={"favorite-icon " + (this.props.note.favorite ? "show" : "") } onClick={this.toggleFavorite}/>

                {!isOwner ?
                    <div className="owner-info">
                        <Img src={"user.svg"} className="owner-info__user-avatar" />
                        <span className="owner-info__username">{this.props.note.username}</span>
                    </div> : ""
                }
            </div>
        );
    }
}