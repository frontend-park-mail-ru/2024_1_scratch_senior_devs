import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import "./RenameTagModal.sass"

export class RenameTagModal extends ScReact.Component<any, any> {
    state ={
        value: "",
        error: "",
        validationResult: false
    }

    componentDidMount() {
        this.setState(state => ({
            ...state,
            value: this.props.tag
        }))
    }

    handleSubmit = () => {

    }

    setValue = (value:string) => {
        this.setState(state => ({
            ...state,
            value: value
        }))
    }

    render() {
        return (
            <div className="rename-tag-form">
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
            </div>
        )
    }
}