import {ScReact} from "@veglem/screact";
import "./SearchBar.sass"
import {AppDispatcher} from '../../modules/dispatcher';
import {NotesActions} from '../../modules/stores/NotesStore';

export class SearchBar extends ScReact.Component<any, any> {
    state = {
        timer: null
    }

    handleChange = (e) => {
        if (this.props.onChange) {
            AppDispatcher.dispatch(NotesActions.START_FETCHING)
            clearTimeout(this.state.timer)
            this.state.timer = setTimeout(() => { this.props.onChange(e.target.value) }, 250)
        }
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