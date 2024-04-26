import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {AppToasts} from "../../modules/toasts";
import "./TagList.sass"
type TagListState = {
    tags: string[],
    value: string,
    open: boolean
}

export class TagList extends ScReact.Component<any, TagListState> {
    state = {
        tags: ["Работа", "Учеба", "ВУЗ"],
        value: "",
        open: false,
        count: 2
    }

    private openBtnRef
    private tagsPanelRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !this.tagsPanelRef.contains(e.target)) {
            this.toggleOpen();
        }
    }

    private inputRef

    setValue = (e) => {
        this.setState(state => ({
            ...state,
            value: e.target.value
        }))
    }

    onInput = (e) => {
        if (e.key == "Enter") {
            this.addTag()
        }

        this.inputRef.value = e.target.value
    }

    addTag = () => {
        if (this.state.value.length > 0) {
            if (this.state.value.length < 2) {
                AppToasts.error("Тэг не может быть короче 2 символов")
                return
            }

            if (this.state.value.length > 10) {
                AppToasts.error("Тэг не может быть длинее 10 символов")
                return
            }

            console.log(this.state.value)

            this.setState(state => ({
                ...state,
                value: "",
                tags: [...state.tags, this.state.value]
            }))

            console.log(this.state.tags)
        }
    }

    deleteTag = (name:string) => {
        const tags = this.state.tags.filter(tag => tag != name)
        console.log(tags)
        this.setState(state => ({
            ...state,
            tags: state.tags.filter(tag => tag != name)
        }))
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    render() {
        const tags =this.state.tags.slice(0)

        return (
            <div className={"tag-list " + (this.state.open ? "open" : "")}>

                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="tag.svg" className="icon" />
                    <span>Тэги</span>
                </div>

                <div className="tags-wrapper" ref={ref => this.tagsPanelRef = ref}>

                    <div className="tag-items">

                        {tags.map(tag => (
                            <div className="tag-item">
                                <span>{tag}</span>
                                <Img src="delete.svg" className="delete-tag-btn" onClick={() => this.deleteTag(tag)}/>
                            </div>
                        ))}

                        <input type="text" placeholder="Введите тэг" value={this.state.value} oninput={this.setValue} onkeyup={this.onInput} ref={ref => this.inputRef = ref}/>

                    </div>

                </div>
            </div>
        )
    }
}