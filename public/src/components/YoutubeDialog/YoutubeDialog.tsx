import {ScReact} from '@veglem/screact';
import {Input} from '../Input/Input';
import {Button} from '../Button/Button';
import './YoutubeDialog.sass';
import {AppNoteStore, NoteStoreActions} from "../../modules/stores/NoteStore";
import {AppDispatcher} from "../../modules/dispatcher";

export class YoutubeDialogForm extends ScReact.Component<any, any> {
    state = {
        value: '',
        validationResult: null,
        errorMessage: ""
    };

    setValue = (val) => {
        this.setState(state => ({
            ...state,
            value: val
        }));
    };

    setError = (value:string) => {
        this.setState(state => ({
            ...state,
            validationResult: false,
            errorMessage: value
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const check = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
        const match = check.exec(this.state.value)
        if (match != null && match.length > 0) {
            console.log(match[1])
            this.insertVideo(match[1])
        } else {
            console.log("Not youtube")
            this.setError("Not youtube")
        }
    };

    insertVideo = (video_id:string) => {
        const block = AppNoteStore.state.note.blocks[AppNoteStore.state.dropdownPos.blockId]
        block.type = "div"
        block.content = undefined;
        block.attributes = {};
        block.attributes['youtube'] = "https://www.youtube.com/embed/" + video_id;
        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
            blockId: AppNoteStore.state.dropdownPos.blockId,
            newBlock: block
        });

        AppDispatcher.dispatch(NoteStoreActions.CLOSE_YOUTUBE_DIALOG)
    }

    render() {
        return (
            <form id="youtube-dialog-form" onsubmit={this.handleSubmit}>
                <h3>Вставить видео из YouTube</h3>
                <Input value={this.state.value} onChange={this.setValue} placeholder="Ссылка" error={this.state.errorMessage} validationResult={this.state.validationResult}/>
                <Button label="Вставить" />
            </form>
        );
    }
}

export default YoutubeDialogForm;