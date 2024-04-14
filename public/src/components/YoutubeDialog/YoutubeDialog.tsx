import {ScReact} from '@veglem/screact';
import {Input} from '../Input/Input';
import {Button} from '../Button/Button';
import './YoutubeDialog.sass';
import {AppNoteStore, NoteStoreActions} from "../../modules/stores/NoteStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {isYoutubeLink, parseYoutubeLink} from '../../modules/utils';
import {AppToasts} from '../../modules/toasts';

export class YoutubeDialogForm extends ScReact.Component<any, any> {
    state = {
        value: '',
        validationResult: null,
        errorMessage: ""
    };

    setValue = (value:string) => {
        this.setState(state => ({
            ...state,
            value: value
        }));
    };

    setError = (value:string) => {
        this.setState(state => ({
            ...state,
            validationResult: false,
            errorMessage: value
        }));
    }

    cleanError = () => {
        this.setState(state => ({
            ...state,
            validationResult: true,
            errorMessage: ""
        }));
    }

    handleChange = (value:string) => {
        this.setValue(value)

        if (isYoutubeLink(value)) {
            this.cleanError()
        } else {
            this.setError("Некорректная ссылка")
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (isYoutubeLink(this.state.value)) {
            const link = parseYoutubeLink(this.state.value)
            this.insertVideo(link)
        } else {
            this.setError("Некорректная ссылка")
            AppToasts.error("Некорректная ссылка")
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

        setTimeout(() => {
            this.setState(state => ({
                ...state,
                value: "",
                validationResult: null,
                errorMessage: ""
            }));
        }, 300)
    }

    render() {
        return (
            <form id="youtube-dialog-form" onsubmit={this.handleSubmit}>
                <h3>Вставить видео из YouTube</h3>
                <Input value={this.state.value} onChange={this.handleChange} placeholder="Ссылка" error={this.state.errorMessage} validationResult={this.state.validationResult}/>
                <Button label="Вставить" />
            </form>
        );
    }
}

export default YoutubeDialogForm;