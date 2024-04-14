import {ScReact} from '@veglem/screact';
import './ShiningButton.sass';

export class ShiningButton extends ScReact.Component<any, any> {
    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick && this.props.onClick(e);
    };

    render() {
        return (
            <div className="shining_btn" onclick={this.handleClick}>
                <div className="shining_btn__glow"></div>
                <div className="shining_btn__border">
                    <span>{this.props.label}</span>
                </div>
            </div>
        );
    }
}