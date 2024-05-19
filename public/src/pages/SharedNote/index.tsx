import {ScReact} from "@veglem/screact";
import "./style.sass"
import {Editor} from "../../components/Editor/Editor";
import "../../components/Editor/Editor.sass"

export class SharedNotePage extends ScReact.Component<any, any> {
    private self

    componentDidMount() {
        console.log(this.props.note)

        this.self.innerHTML = ""
        new Editor(
            this.props.note.data.content,
            this.self,
            {open: () => {}, close: () => {}},
            () => {},
            {open: () => {}, close: () => {}}
        );

    }

    render () {
        return (
            <div className="shared-note-page">
                <div className="note-editor">
                    <div className="note-title">{this.props.note.data.title}</div>
                    <div className="note-body" ref={elem => this.self = elem}></div>
                </div>
            </div>
        )
    }
}