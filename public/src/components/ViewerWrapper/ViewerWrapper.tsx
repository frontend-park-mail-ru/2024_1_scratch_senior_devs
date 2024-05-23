import {ScReact} from "@veglem/screact";
import "./ViewerWrapper.sass"
import {Img} from "../Image/Image";
import {Tooltip} from "../Tooltip/Tooltip";
import NoteMenu from "../NoteMenu/NoteMenu";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import {Editor} from "../Editor/Editor";
import {AppRouter} from "../../modules/router";
import {NoteType} from "../../utils/types";

type ViewerWrapperProps = {
    fullScreen: boolean
    note: NoteType
    openFullScreen: () => void
    closeFullScreen: () => void
}

export class ViewerWrapper extends ScReact.Component<ViewerWrapperProps, any> {
    private noteContentRef
    private viewerRef

    componentDidMount() {
        this.noteContentRef.innerHTML = ""
        new Editor(
            this.props.note.data.content,
            this.noteContentRef,
            {open: () => {}, close: () => {}},
            () => {},
            {open: () => {}, close: () => {}}
        );
    }

    closeViewer = () => {
        AppRouter.go("/")
    }

    exportToPDF = () => {
        AppDispatcher.dispatch(NotesActions.EXPORT_TO_PDF, this.viewerRef.outerHTML)
    }

    render() {
        return (
            <div className={"note-viewer-wrapper " + (this.props.fullScreen ? "fullscreen" : "")}>

                {/*<div className="note-background" style={`background: ${this.props.note.header};`}>*/}

                {/*</div>*/}

                <div className="top-panel" style={`background: ${this.props.note.header};`}>

                    <div className="back-btn-container" onclick={this.closeViewer}>
                        <Img src="left-chevron.svg" className="back-icon"/>
                        <span className="back-label">На главную</span>
                    </div>

                    <div className="empty">

                    </div>

                    <NoteMenu
                        note={this.props.note}
                        onExportToPdf={this.exportToPDF}
                    />

                    {!this.props.fullScreen ?
                        <Tooltip
                            icon="full-screen-open.svg"
                            hoverTooltip="На весь экран"
                            showHoverTooltip={true}
                            className="toggle-fullscreen-btn"
                            onClick={this.props.openFullScreen}/>
                        :
                        <Tooltip
                            icon="full-screen-close.svg"
                            showHoverTooltip={true}
                            hoverTooltip="Уменьшить"
                            className="toggle-fullscreen-btn"
                            onClick={this.props.closeFullScreen}/>
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