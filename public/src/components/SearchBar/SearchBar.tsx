import {ScReact} from '@veglem/screact';
import './SearchBar.sass';

class SearchBar extends ScReact.Component<any, any> {
    state = {
        timer: null
    };

    handleChange = (e) => {
        if (this.props.onChange) {
            this.props.onStartTyping();
            clearTimeout(this.state.timer);
            this.state.timer = setTimeout(() => { this.props.onChange(e.target.value); }, 250);
        }
    };

    render() {
        return (
            <div className="search">
                <input type="text" className="search-input" placeholder="Поиск..." oninput={this.handleChange} />
                <img src="/src/assets/search.svg" alt="" className="search-icon"/>
            </div>
        );
    }
}

export default SearchBar