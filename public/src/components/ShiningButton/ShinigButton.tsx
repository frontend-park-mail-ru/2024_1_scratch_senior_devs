import {ScReact} from "@veglem/screact";
import "./ShiningButton.sass"

export class ShiningButton extends ScReact.Component<any, any> {
    handleClick = (e) => {
        e.preventDefault()
        this.props.onClick && this.props.onClick(e);
    }

    render() {
        return (
            <div className="animated-border-box-container" onclick={this.handleClick}>
                <div className=" animated-border-box-glow"></div>
                <div className="animated-border-box">
                    <h3>{this.props.label}</h3>
                </div>
            </div>
        )
    }
}