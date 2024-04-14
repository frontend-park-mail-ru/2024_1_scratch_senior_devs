import {ScReact} from '@veglem/screact';
import {Input} from '../Input/Input';
import {Button} from '../Button/Button';
import './YoutubeDialog.sass';
import {AppNoteStore, NoteStoreActions} from "../../modules/stores/NoteStore";
import {AppDispatcher} from "../../modules/dispatcher";

export class YoutubeDialogForm extends ScReact.Component<any, any> {
    state = {
        value: ''
    };

    setValue = (val) => {
        this.setState(state => ({
            ...state,
            value: val
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit');
        console.log(this.state.value);
        const check = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
        const match = check.exec(this.state.value)
        if (match != null && match.length > 0) {
            console.log(match[1])
            const block = AppNoteStore.state.note.blocks[AppNoteStore.state.dropdownPos.blockId]
            block.content = undefined;
            block.attributes = {};
            block.attributes['youtube'] = "https://www.youtube.com/embed/" + match[1];
            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                blockId: AppNoteStore.state.dropdownPos.blockId,
                newBlock: block
            });
        } else {
            console.log("Not youtube")
        }

        // TODO: проверка ссылки на валидоность
    };

    render() {
        return (
            <form id="youtube-dialog-form" onsubmit={this.handleSubmit}>
                <h3>Вставить видео из YouTube</h3>
                <Input value={this.state.value} onChange={this.setValue} placeholder="Ссылка"/>
                <Button label="Вставить" />
            </form>
        );
    }
}

export default YoutubeDialogForm;