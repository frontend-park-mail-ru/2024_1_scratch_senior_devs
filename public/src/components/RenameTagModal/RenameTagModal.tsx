import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import "./RenameTagModal.sass"
import {ValidatePassword} from "../../modules/validation";
import {AppToasts} from "../../modules/toasts";

export class RenameTagModal extends ScReact.Component<any, any> {
    state ={
        value: "",
        error: "",
        validationResult: false
    }

    validate = () => {
        if (this.state.value == this.props.tag) {
            this.setError('Новое название совпадает со старым');
            this.setValidated(false);
            return;
        }

        if (this.state.value.length <= 2) {
            this.setError('Тэг слишком короткий');
            this.setValidated(false);
            return;
        }

        if (this.state.value.length > 12) {
            this.setError('Тэг слишком длинный');
            this.setValidated(false);
            return;
        }

        if (this.props.tags.includes(this.state.value)) {
            this.setError('Такой тэг уже существует');
            this.setValidated(false);
            return
        }

        this.setError("");
        this.setValidated(true);
    };

    handleSubmit = (e:FormDataEvent) => {
        e.preventDefault()
        this.validate()
        if (this.state.validationResult) {
            this.props.onSuccess(this.state.value)
            setTimeout(() => {
                this.setState(state => ({
                    ...state,
                    value: "",
                    error: "",
                    validationResult: false
                }))
            }, 500)
        }
    }

    setValue = (value:string) => {
        this.setState(state => ({
            ...state,
            value: value
        }))

        this.validate()
    }

    setError = (error:string) => {
        this.setState(state => ({
            ...state,
            error: error
        }))
    }

    setValidated = (result:boolean) => {
        this.setState(state => ({
            ...state,
            validationResult: result
        }))
    }

    render() {
        return (
            <form className="rename-tag-form" onsubmit={this.handleSubmit}>
                <Img src="close.svg" className="close-modal-btn" onClick={this.props.handleClose}/>
                <h2>Форма изменения тэга</h2>
                <Input
                    type="text"
                    placeholder="Введите новое название"
                    value={this.state.value}
                    onChange={this.setValue}
                    error={this.state.error}
                    validationResult={this.state.validationResult}
                />
                <Button label="Сохранить" onClick={this.handleSubmit}/>
            </form>
        )
    }
}