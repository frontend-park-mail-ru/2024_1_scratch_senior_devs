import {ScReact} from "@veglem/screact";
import "./SearchBar.sass"
import {debounce} from '../../utils/debauncer';

export class SearchBar extends ScReact.Component<any, any> {
    handleChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e.target.value)
        }
    }

    render() {
        return (
            <div className="search">
                <input type="text" className="search-input" placeholder="Поиск..." oninput={debounce(this.handleChange, 250)} />
                <img src="/src/assets/search.svg" alt="" className="search-icon"/>
            </div>
        )
    }
}