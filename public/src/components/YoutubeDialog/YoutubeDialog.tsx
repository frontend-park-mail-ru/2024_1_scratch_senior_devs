import {ScReact} from '@veglem/screact';
import {Input} from '../Input/Input';
import {Button} from '../Button/Button';
import './YoutubeDialog.sass';

import {parseYoutubeLink} from '../../modules/utils';
import {AppToasts} from '../../modules/toasts';
import {insertBlockPlugin} from "../Editor/Plugin";

export class YoutubeDialogForm extends ScReact.Component<any, any> {
    state = {
        value: '',
        validationResult: null,
        errorMessage: ''
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
    };

    cleanError = () => {
        this.setState(state => ({
            ...state,
            validationResult: true,
            errorMessage: ''
        }));
    };

    handleChange = (value:string) => {

        this.setValue(value);

        if (parseYoutubeLink(value)) {
            this.cleanError();
        } else {
            this.setError('Некорректная ссылка');
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const video_id = parseYoutubeLink(this.state.value);
        if (video_id) {
            this.insertVideo(video_id);
        } else {
            this.setError('Некорректная ссылка');
            AppToasts.error('Некорректная ссылка');
        }
    };

    insertVideo = (video_id:string) => {
        // TODO: ?autoplay=1
        insertBlockPlugin('youtube', 'https://www.youtube.com/embed/' + video_id)

        this.props.handleClose()
    };

    render() {
        return (
            <form id="youtube-dialog-form" onsubmit={this.handleSubmit}>
                <h3>Вставить видео из YouTube</h3>
                <Input value={this.state.value} onChange={this.handleChange} placeholder="Ссылка" focused={true} error={this.state.errorMessage} validationResult={this.state.validationResult}/>
                <Button label="Вставить" />
            </form>
        );
    }
}

export default YoutubeDialogForm;