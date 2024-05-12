import {ScReact} from '@veglem/screact';
import {Img} from '../Image/Image';
import './LinkInput.sass';

export class LinkInput extends ScReact.Component<any, any> {
    state = {
        value: ''
    };

    setValue = (e) => {
        this.setState(state => ({
            ...state,
            value: e.target.value
        }));
    };

    clearValue = () => {
        this.setState(state => ({
            ...state,
            value: ''
        }));
    };

    handleSubmit = () => {
        if (this.state.value) {
            
            this.props.onSubmit(this.state.value);
            this.clearValue();
        }
    };

    isUrlValid(userInput) {
        let res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (res == null)
            return false;
        else
            return true;
    }

    render() {
        return (
            <div className={'link-input-container ' + (this.props.open ? 'open' : '')}>
                <input type="text" placeholder="Введите ссылку" className="link-input" oninput={this.setValue} value={this.state.value}/>
                <button type="submit" className="link-btn" onclick={this.handleSubmit}>
                    <Img src="daw.svg" className="success-icon"/>
                </button>
            </div>
        );
    }
}