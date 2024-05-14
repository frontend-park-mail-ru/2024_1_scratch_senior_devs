import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {AppToasts} from "../../modules/toasts";
import "./TagList.sass"
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {MAX_TAG_COUNT, MAX_TAG_LENGTH, MIN_TAG_LENGTH} from "../../utils/consts";

type TagListState = {
    selectedTag: string | null,
    value: string
}

export class TagList extends ScReact.Component<any, TagListState> {
    state = {
        selectedTag: null,
        value: "",
        tags: [...AppNotesStore.state.tags]
    }

    private inputRef

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        AppNotesStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (store:NotesStoreState) => {
        this.setState(state => ({
            ...state,
            tags: store.tags
        }))
    }

    setValue = (e) => {
        this.setState(state => ({
            ...state,
            value: e.target.value
        }))
    }

    onInput = (e) => {
        if (e.key == "Backspace") {
            if (this.state.selectedTag) {
                this.removeTag(this.state.selectedTag)
                this.setState(state => ({
                    ...state,
                    selectedTag: null
                }))
            } else {
                if (!this.state.value) {
                    this.setState(state => ({
                        ...state,
                        selectedTag: this.props.tags.at(-1)
                    }))
                }
            }
        }

        if (e.key == "Enter") {
            this.handleAddTag()
        }

        this.inputRef.value = e.target.value
    }

    handleAddTag = () => {
        if (this.state.value.length > 0) {
            if (this.state.value.length < MIN_TAG_LENGTH) {
                AppToasts.error(`Тэг не может быть короче ${MIN_TAG_LENGTH} символов`)
                return
            }

            if (this.state.value.length > MAX_TAG_LENGTH) {
                AppToasts.error(`Тэг не может быть длинее ${MAX_TAG_LENGTH} символов`)
                return
            }

            if (this.props.tags.includes(this.state.value)) {
                AppToasts.error(`Такой тэг уже существует`)
                return
            }

            if (this.props.tags.length >= MAX_TAG_COUNT) {
                AppToasts.info(`Максимальное кол-во тэгов - ${MAX_TAG_COUNT}`)
                return
            }

            this.addTag(this.state.value)

            this.setState(state => ({
                ...state,
                value: ""
            }))

        }
    }

    addTag = (tagname:string) => {
        AppDispatcher.dispatch(NotesActions.ADD_TAG_TO_NOTE, tagname)
        this.props.onChange([...this.props.tags, tagname])
    }

    removeTag = (tagname:string) => {
        AppDispatcher.dispatch(NotesActions.REMOVE_TAG_FROM_NOTE, tagname)
        this.props.onChange(this.props.tags.filter(tag => tag != tagname))
    }

    handleSelectTag = (tagname:string) => {
        if (this.props.tags.includes(tagname)) {
            this.removeTag(tagname)
        } else {
            this.addTag(tagname)
        }
    }

    render() {
        if (!this.props.tags) {
            return (
                <div></div>
            )
        }

        return (
            <div className="tags-wrapper">

                <form className="tag-items" onsubmit={(e) => e.preventDefault()}>

                    {this.props.tags.map(tag => (
                        <div className={"tag-item " + (this.state.selectedTag == tag ? "selected" : "")}>
                            <span>{tag}</span>
                            <Img src="delete.svg" className="delete-tag-btn" onClick={() => this.removeTag(tag)}/>
                        </div>
                    ))}

                    <div className="hidden">
                        <span>Hidden</span>
                    </div>

                    <input type="text" placeholder="Введите тэг" value={this.state.value} oninput={this.setValue} onkeyup={this.onInput} ref={ref => this.inputRef = ref}/>

                </form>

                <div className="global-tags-wrapper">
                    <h3>Все тэги</h3>
                    <div className="global-tags-container">
                        {this.state.tags.map(tag => (
                            <div className={"tag-item " + (this.props.tags.includes(tag) ? "selected" : "")} onclick={() => this.handleSelectTag(tag)}>
                                <span>{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        )
    }
}