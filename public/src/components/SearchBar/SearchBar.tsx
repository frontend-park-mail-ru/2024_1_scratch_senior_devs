import {ScReact} from "@veglem/screact";
import "./SearchBar.sass"

export class SearchBar extends ScReact.Component<any, any> {
    handleChange = (e) => {
        this.props.onChange && this.props.onChange(e.target.value)
    }

    render() {
        return (
            <div className="search">
                <input type="text" className="search-input" placeholder="Поиск..." oninput={this.handleChange} />
                <img src="/src/assets/search.svg" alt="" className="search-icon"/>
            </div>
        )
    }
}