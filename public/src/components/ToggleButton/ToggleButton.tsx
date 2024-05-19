import {ScReact} from '@veglem/screact';
import './ToggleButton.sass';

type ToggleButtonProps = {
    label?: string
    value: boolean
    onToggle: (value) => void
}

export class ToggleButton extends ScReact.Component<ToggleButtonProps, any> {
    state = {
        select: false
    };

    componentDidMount() {
        this.setState(state => ({
            ...state,
            select: this.props.value
        }));
    }

    toggle = () => {
        this.setState(state => ({
           ...state,
           select: !state.select
        }));

        if (this.props.onToggle) {
            this.props.onToggle(this.state.select);
        }
    };

    render() {
        return (
            <div className="toggle-button-container">
                <label className="toggle-label" onclick={this.toggle}>{this.props.label}</label>
                <div className={'toggle ' + (this.state.select ? 'active' : '')} onclick={this.toggle}></div>
            </div>
        );
    }
}