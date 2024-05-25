import {ScReact} from '@veglem/screact';
import './ToggleButton.sass';

type ToggleButtonProps = {
    label?: string
    value: boolean
    onToggle: (value) => void
}

export class ToggleButton extends ScReact.Component<ToggleButtonProps, any> {
    toggle = () => {
        if (this.props.onToggle) {
            this.props.onToggle(!this.props.value);
        }
    };

    render() {
        return (
            <div className="toggle-button-container">
                <label className="toggle-label" onclick={this.toggle}>{this.props.label}</label>
                <div className={'toggle ' + (this.props.value ? 'active' : '')} onclick={this.toggle}></div>
            </div>
        );
    }
}