import {ScReact} from '@veglem/screact';
import './Button.sass';

export class Button extends ScReact.Component<any, any>{

    handleClick = (e) => {
        this.props.onClick && !this.props.disabled && this.props.onClick(e);
    };

    render() {
        return (
            <button type="submit" className={'button ' + (this.props.className ? this.props.className : '') + (this.props.disabled ? ' disabled' : '')} onclick={this.handleClick}>
                {this.props.label}
            </button>
        );
    }
}
