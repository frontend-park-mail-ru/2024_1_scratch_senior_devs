import {ScReact} from "@veglem/screact";
import "./AvatarUploadLoader.sass"

export class AvatarUploadLoader extends ScReact.Component<any, any> {
    render() {
        return (
            <div className={"progress-wrapper " + (this.props.active ? "active" : "")}>
                <div className="inner"></div>
                <div className="checkmark">
                    <span></span>
                    <span></span>
                </div>
                <div className="circle">
                    <div className="bar left">
                        <div className="progress"></div>
                    </div>
                    <div className="bar right">
                        <div className="progress"></div>
                    </div>
                </div>
            </div>
        )
    }
}