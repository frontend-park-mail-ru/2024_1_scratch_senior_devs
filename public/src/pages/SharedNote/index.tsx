import {ScReact} from "@veglem/screact";
import "./style.sass"
import "../../components/Editor/Editor.sass"
import {ViewerWrapper} from "../../components/ViewerWrapper/ViewerWrapper";

export class SharedNotePage extends ScReact.Component<any, any> {
    render () {
        return (
            <div className="shared-note-page">
                <ViewerWrapper note={this.props.note} />
            </div>
        )
    }
}