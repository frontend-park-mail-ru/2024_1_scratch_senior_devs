import {ScReact} from '@veglem/screact';
import {Img} from '../Image/Image';
import "./Attach.sass"

export class Attach extends ScReact.Component<any, any> {
    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        return (
            <a key1={"href"} href={this.props.href} className="attach-container" download>
                <div className="file-extension-label">
                    {this.props.ext}
                </div>
                <span className="file-name">
                    {this.props.fileName}
                    </span>
                <span className="close-attach-btn-container">
                    <Img src="close.svg" className="close-attach-btn" onClick={(e) => {
                        e.preventDefault();
                        this.props.handleRemove()
                    }}/>
                </span>
            </a>
        )
    }
}