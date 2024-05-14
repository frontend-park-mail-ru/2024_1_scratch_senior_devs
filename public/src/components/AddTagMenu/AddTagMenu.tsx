import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./AddTagMenu.sass"
import {AppToasts} from "../../modules/toasts";
import {MAX_TAG_LENGTH, MIN_TAG_LENGTH} from "../../utils/consts";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";

type AddTagMenuProps = {
    tags: string[]
}

export class AddTagMenu extends ScReact.Component<AddTagMenuProps, any> {
    state = {
        open: false
    }

    private inputContainerRef
    private inputRef
    private openBtnRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !this.inputContainerRef.contains(e.target)) {
            this.toggleOpen();
        }
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))

        this.inputRef.focus()
    }

    close = () => {
        this.setState(state => ({
            ...state,
            open: false
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const value = this.inputRef.value
        if (value.length > 0) {
            if (value < MIN_TAG_LENGTH) {
                AppToasts.error(`Тэг не может быть короче ${MIN_TAG_LENGTH} символов`)
                return
            }

            if (value > MAX_TAG_LENGTH) {
                AppToasts.error(`Тэг не может быть длинее ${MAX_TAG_LENGTH} символов`)
                return
            }

            if (this.props.tags.includes(value)) {
                AppToasts.info("Такой тэг уже существует")
                return
            }

            AppDispatcher.dispatch(NotesActions.ADD_TAG, value)

            this.close()

            setTimeout(() => {
                this.inputRef.value = ""
            }, 150)
        }
    }

    render() {
        return (
            <div className="add-tag">
                <div className="add-tag__btn-container" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="tag.svg" className="icon"/>
                </div>
                <form className={'add-tag__input-container ' + (this.state.open ? 'open' : '')} ref={ref => this.inputContainerRef = ref} onsubmit={this.handleSubmit}>
                    <input type="text" placeholder="Добавить тэг" ref={ref => this.inputRef = ref}/>
                    <button type="submit" onclick={this.handleSubmit}>
                        <Img src="book.svg" />
                    </button>
                </form>
            </div>

        )
    }
}