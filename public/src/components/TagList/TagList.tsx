import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {AppToasts} from "../../modules/toasts";
import "./TagList.sass"
import {AppNotesStore, NotesActions, NotesStoreState} from "../../modules/stores/NotesStore";
import {AppDispatcher} from "../../modules/dispatcher";

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

    private inputRef
    private openBtnRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);

        this.setState(state => {
            return {
                ...state,
                tags: AppNotesStore.state.selectedNoteTags
            };
        });

        AppNotesStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !e.target.matches(".tags-wrapper,.tags-wrapper *")) {
            // this.toggleOpen();
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
                AppToasts.error(`Тэг не может быть короче ${this.MIN_TAG_LENGTH} символов`)
                return
            }

            if (this.state.value.length > this.MAX_TAG_LENGTH) {
                AppToasts.error(`Тэг не может быть длинее ${this.MAX_TAG_LENGTH} символов`)
                return
            }

            if (this.state.tags.includes(this.state.value)) {
                AppToasts.error(`Такой тэг уже существует`)
                return
            }

            AppDispatcher.dispatch(NotesActions.CREATE_TAG, {
                note: AppNotesStore.state.selectedNote,
                tag: this.state.value
            })

            this.setState(state => ({
                ...state,
                value: ""
            }))
        }
    }

    deleteTag = (tag:string) => {
        AppDispatcher.dispatch(NotesActions.REMOVE_TAG, tag)
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    render() {
        return (
            <div className={"tag-list " + (this.state.open ? "open" : "")}>

                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="tag.svg" className="icon" />
                    <span>Тэги</span>
                </div>

                <div className="tags-wrapper">

                    <div className="tag-items">

                        {this.state.tags.map(tag => (
                            <div className={"tag-item " + (this.state.selectedTag == tag ? "selected" : "")}>
                                <span>{tag}</span>
                                <Img src="delete.svg" className="delete-tag-btn" onClick={() => this.deleteTag(tag)}/>
                            </div>
                        ))}

                        <div className="hidden">
                            <span>Hidden</span>
                        </div>

                        <input type="text" placeholder="Введите тэг" value={this.state.value} oninput={this.setValue} onkeyup={this.onInput} ref={ref => this.inputRef = ref}/>

                    </div>

                </div>
            </div>
        )
    }
}