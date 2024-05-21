import {ScReact} from "@veglem/screact";
import "./ViewerWrapper.sass"
import {Img} from "../Image/Image";
import {Tooltip} from "../Tooltip/Tooltip";
import NoteMenu from "../NoteMenu/NoteMenu";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import {Editor} from "../Editor/Editor";
import {AppRouter} from "../../modules/router";

export class ViewerWrapper extends ScReact.Component<any, any> {
    private noteContentRef
    private viewerRef

    state = {
        fullScreen: false
    }

    componentDidMount() {
        console.log(this.props.note)

        this.noteContentRef.innerHTML = ""
        new Editor(
            this.props.note.data.content,
            this.noteContentRef,
            {open: () => {}, close: () => {}},
            () => {},
            {open: () => {}, close: () => {}}
        );
    }

    closeEditor = () => {
        AppRouter.go("/")
    }

    openFullScreen = () => {
        AppDispatcher.dispatch(NotesActions.OPEN_FULLSCREEN)
    }

    closeFullScreen = () => {
        AppDispatcher.dispatch(NotesActions.CLOSE_FULLSCREEN)
    }

    exportToPDF = () => {
        AppDispatcher.dispatch(NotesActions.EXPORT_TO_PDF, this.viewerRef.outerHTML)
    }

    exportToZip = () => {
        AppDispatcher.dispatch(NotesActions.EXPORT_TO_ZIP, {
            note_id: this.props.note.id,
            content: this.viewerRef.outerHTML
        })
    }

    render() {
        return (
            <div className="note-viewer-wrapper">

                {/*<div className="note-background" style={`background: ${this.props.note.header};`}>*/}

                {/*</div>*/}

                <div className="top-panel" style={`background: ${this.props.note.header};`}>

                    <div className="back-btn-container" onclick={this.closeEditor}>
                        <Img src="left-chevron.svg" className="back-icon"/>
                        <span className="back-label">На главную</span>
                    </div>

                    <div className="empty">

                    </div>

                    <NoteMenu
                        note={this.props.note}
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

                </div>

                <div className="bottom-panel">
                    <div className="note-editor" ref={ref => this.viewerRef = ref}>
                        <div className="note-title">{this.props.note.data.title}</div>
                        <div className="note-body" ref={elem => this.noteContentRef = elem}></div>
                    </div>
                </div>
            </div>
        )
    }
}