import {ScReact} from '@veglem/screact';
import './ShiningButton.sass';

export class ShiningButton extends ScReact.Component<any, any> {
    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick && this.props.onClick(e);
    };

    render() {
        return (
            <div className="shining-button-container" onclick={this.handleClick}>
                <div className="shining-button-glow"></div>
                <div className="shining-button">
                    <span>{this.props.label}</span>
                </div>
            </div>
        );
    }
}