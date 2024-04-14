import {ScReact} from '@veglem/screact';
import './ShineButton.sass';

export class ShineButton extends ScReact.Component<any, any> {
    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick && this.props.onClick(e);
    };

    render() {
        return (
            <button className="shine-button" onclick={this.handleClick}>
                {this.props.label}
            </button>
        );
    }
}