import {ScReact} from '@veglem/screact';
import {Input} from '../Input/Input';
import {Button} from '../Button/Button';
import './YoutubeDialog.sass';

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