import {ScReact} from '@veglem/screact';
import './Note.sass';
import {formatDate, parseNoteTitle, truncate} from "../../modules/utils";


const MAX_NOTE_CONTENT_PREVIEW_LENGTH = 25;

export class Note extends ScReact.Component<any, any> {
    render() {
        return (
            <div className={'note-container ' + (this.props.selected ? 'selected' : '')} id={this.props.note.id} >
                <h3>{truncate(parseNoteTitle(this.props.note.data.title), MAX_NOTE_CONTENT_PREVIEW_LENGTH)}</h3>
                <div className="note-tags-container">
                    {this.props.tags.slice(0, 2).map(tag => (
                        <span className="note-tag">{tag}</span>
                    ))}
                    {this.props.tags.length > 2 ? <span className="note-tag">+{(this.props.tags.length - 2).toString()}</span> : ""}
                </div>
                <span className="update-time">{formatDate(this.props.note.update_time)}</span>
            </div>
        );
    }
}