import {ScReact} from '@veglem/screact';
import './Note.sass';
import {formatDate, parseNoteTitle, truncate} from "../../modules/utils";
import {NoteType} from "../../utils/types";
import {AppUserStore} from "../../modules/stores/UserStore";

const MAX_NOTE_CONTENT_PREVIEW_LENGTH = 25;
const MAX_TAGS_PREVIEW_LENGTH = 2;

type NoteProps = {
    note: NoteType,
    selected: boolean
}

export class Note extends ScReact.Component<NoteProps, any> {
    render() {

        const isOwner= this.props.note.owner_id == AppUserStore.state.user_id

        return (
            <div className={'note-container ' + (this.props.selected ? 'selected' : '')} id={this.props.note.id} >
                <h3>{truncate(parseNoteTitle(this.props.note.data.title), MAX_NOTE_CONTENT_PREVIEW_LENGTH)}</h3>
                <div className="note-tags-container">
                    {this.props.note.tags.length > 0 && isOwner ? this.props.note.tags.slice(0, MAX_TAGS_PREVIEW_LENGTH).map(tag => (
                        <span className="note-tag">{tag}</span>
                    )) : ""}
                    {this.props.note.tags.length > MAX_TAGS_PREVIEW_LENGTH && isOwner  ? <span className="note-tag">+{(this.props.note.tags.length - MAX_TAGS_PREVIEW_LENGTH).toString()}</span> : ""}
                </div>
                <span className="update-time">{formatDate(this.props.note.update_time)}</span>
            </div>
        );
    }
}