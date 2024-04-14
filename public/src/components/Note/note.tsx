import {ScReact} from '@veglem/screact';
import './note.sass';
import {formatDate, truncate} from '../../modules/utils';

type NoteState = {
    id: number,
    title: string,
    content: string,
    update_time: string
}

const MAX_NOTE_CONTENT_PREVIEW_LENGTH = 25;

export class Note extends ScReact.Component<any, NoteState> {
    state = {
        id: 0,
        title: '',
        content: '',
        update_time: ''
    };

    componentDidMount() {
        this.setState(state => ({
            ...state,
            id: this.props.note.id,
            title: this.props.note.data.title,
            content: truncate(this.props.note.data.content, MAX_NOTE_CONTENT_PREVIEW_LENGTH),
            update_time: formatDate(this.props.note.update_time)
        }));
    }

    render() {
        return (
            <div className={'note ' + (this.props.selected ? 'selected' : '')} id={this.props.note.id} >
                <h3 className="note__title">{this.props.note.data.title}</h3>
                <p className="note__content">{this.props.note.data.content}</p>
                <span className="note__update-time">{this.state.update_time}</span>
            </div>
        );
    }
}