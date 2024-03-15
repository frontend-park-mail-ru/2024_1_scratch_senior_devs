import {ScReact} from "@veglem/screact";
import "./note.sass"

export class Note extends ScReact.Component<any, any> {
    state = {
        update_time: new Date()
    }

    render() {
        return (
            <div className="note-container" id={this.props.id}>
                <h3>{this.props.title}</h3>
                <p>{this.props.content}</p>
                <span className="update-time">{this.state.update_time}</span>
            </div>
        )
    }
}