import {ScReact} from '@veglem/screact';
import {Img} from '../Image/Image';
import './Attach.sass';
import {AppDispatcher} from '../../modules/dispatcher';
import {NotesActions} from '../../modules/stores/NotesStore';

export class Attach extends ScReact.Component<any, any> {
    private closeBtnRef;

    componentDidMount() {
        super.componentDidMount();
    }

    downloadAttach = (e) => {
        console.log('downloadAttach');
        if (!this.closeBtnRef.contains(e.target)){
            AppDispatcher.dispatch(NotesActions.DOWNLOAD_FILE, {
                id: this.props.id,
                name: this.props.fileName
            });
        }
    };

    render() {
        return (
            <div className="attach">
                <div className="attach__body" onmousedown={this.downloadAttach}>
                    <div className="attach__file-extension-label">
                        {this.props.fileName.split('.')[1]}
                    </div>
                    <span className="attach__file-name">
                    {this.props.fileName}
                </span>
                <span className="attach__close-btn-container">
                    <Img
                        src="close.svg"
                        className="attach__close-btn"
                        ref={ref => this.closeBtnRef = ref}
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.handleRemove();
                        }}/>
                </span>
                </div>
            </div>
        );
    }
}