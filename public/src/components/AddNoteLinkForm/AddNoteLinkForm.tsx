import {ScReact} from "@veglem/screact";
import "./AddNoteLinkForm.sass"
import SearchBar from "../SearchBar/SearchBar";
import {Button} from "../Button/Button";

export class AddNoteLinkForm extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="add-note-link-form">
                <h3>Выбор заметки</h3>
                <SearchBar/>
                <div className="buttons-container">
                    <Button label="Добавить заметку" />
                    <Button label="Создать новую" />
                </div>
            </div>
        )
    }
}

export default AddNoteLinkForm