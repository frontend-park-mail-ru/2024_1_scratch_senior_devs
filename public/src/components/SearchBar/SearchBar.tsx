import {ScReact} from "@veglem/screact";
import "./SearchBar.sass"

export class SearchBar extends ScReact.Component<any, any> {

    render() {
        return (
            <div className="search">
                <input type="text" className="search-input" placeholder="Поиск..."/>
                <img src="/src/assets/search.svg" alt="" className="search-icon"/>
            </div>
        )
    }
}