import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {AppToasts} from "../../modules/toasts";
import "./TagList.sass"
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppNoteStore} from "../../modules/stores/NoteStore";

type TagListState = {
    tags: string[],
    value: string,
    open: boolean
}

export class TagList extends ScReact.Component<any, TagListState> {
    state = {
        tags: [],
        selectedTag: null,
        value: "",
        open: false
    }

    private MIN_TAG_LENGTH = 2
    private MAX_TAG_LENGTH = 12

    private wrapperRef
    private inputRef
    private openBtnRef
    private tagsPanelRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);

        AppNotesStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !this.tagsPanelRef.contains(e.target)) {
            this.toggleOpen();
        }
    }

    updateState = (store:NotesStoreState) => {
        console.log("updateState")
        console.log(store)
        this.setState(state => {
            return {
                ...state,
                tags: store.selectedNoteTags
            };
        });
    };

    setValue = (e) => {
        this.setState(state => ({
            ...state,
            value: e.target.value
        }))
    }

    onInput = (e) => {
        if (e.key == "Backspace") {
            if (this.state.selectedTag) {
                this.deleteTag(this.state.selectedTag)
                this.setState(state => ({
                    ...state,
                    selectedTag: null
                }))
            } else {
                if (!this.state.value) {
                    this.setState(state => ({
                        ...state,
                        selectedTag: this.state.tags.at(-1)
                    }))
                }
            }
        }

        if (e.key == "Enter") {
            this.addTag()
        }

        this.inputRef.value = e.target.value
    }

    addTag = () => {
        if (this.state.value.length > 0) {
            if (this.state.value.length < this.MIN_TAG_LENGTH) {
                AppToasts.error("Тэг не может быть короче ${this.MIN_TAG_LENGTH} символов")
                return
            }

            if (this.state.value.length > this.MAX_TAG_LENGTH) {
                AppToasts.error(`Тэг не может быть длинее ${this.MAX_TAG_LENGTH} символов`)
                return
            }

            this.props.onAddTag(this.state.value)

            // this.setState(state => ({
            //     ...state,
            //     value: "",
            //     tags: [...state.tags, this.state.value]
            // }))
        }
    }

    deleteTag = (name:string) => {
        this.setState(state => ({
            ...state,
            tags: state.tags.filter(tag => tag != name)
        }))
    }

    toggleOpen = () => {
        console.log("toggleOpen")

        this.setState(state => ({
            ...state,
            open: !state.open
        }))

        // this.wrapperRef.classList.toggle("open")
    }

    render() {
        return (
            <div className={"tag-list " + (this.state.open ? "open" : "")}>

                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="tag.svg" className="icon" />
                    <span>Тэги</span>
                </div>

                <div className="tags-wrapper" ref={ref => this.tagsPanelRef = ref}>

                    <div className="tag-items">

                        {this.state.tags.map(tag => (
                            <div className={"tag-item " + (this.state.selectedTag == tag ? "selected" : "")}>
                                <span>{tag}</span>
                                <Img src="delete.svg" className="delete-tag-btn" onClick={() => this.deleteTag(tag)}/>
                            </div>
                        ))}

                        <div className="hidden">

                        </div>

                        <input type="text" placeholder="Введите тэг" value={this.state.value} oninput={this.setValue} onkeyup={this.onInput} ref={ref => this.inputRef = ref}/>

                    </div>

                </div>
            </div>
        )
    }
}