import {ScReact} from '@veglem/screact';
import {Img} from '../Image/Image';
import './Attach.sass';
import {AppDispatcher} from '../../modules/dispatcher';
import {NotesActions} from '../../modules/stores/NotesStore';
import {truncate} from '../../modules/utils';

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
            <div className="attach-wrapper">
                <div className="attach-container" onmousedown={this.downloadAttach}>
                    <div className="file-extension-label">
                        {this.props.fileName.split('.')[1]}
                    </div>
                    <span className="file-name">
                    {truncate(this.props.fileName, 25)}
                </span>
                <span className="close-attach-btn-container">
                    <Img
                        src="close.svg"
                        className="close-attach-btn"
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