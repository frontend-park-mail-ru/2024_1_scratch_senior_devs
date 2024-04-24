import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {AppToasts} from "../../modules/toasts";

type TagListState = {
    tags: string[],
    value: string,
    expanded: boolean
}

export class TagList extends ScReact.Component<any, TagListState> {
    state = {
        tags: ["Работа", "Учеба", "ВУЗ"],
        value: "",
        expanded: false,
        count: 2
    }

    componentDidMount() {
        this.calculateTags()
    }

    calculateTags = () => {
        let tmp = 0
        let i = 0

        this.state.tags.length > 0 && this.state.tags.forEach(tag => {
            tmp += tag.length

            if (i < 2 && tmp < 12 || tmp < 10 && i < 3) {
                i += 1
            }
        })

        this.setState(state => ({
            ...state,
            count: i
        }))
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

            this.calculateTags()
        }
    }

    deleteTag = (name:string) => {
        console.log("deleteTag")
        const tags = this.state.tags.filter(tag => tag != name)
        console.log(tags)
        this.setState(state => ({
            ...state,
            tags: state.tags.filter(tag => tag != name)
        }))
    }

    toggleExpanded = () => {
        this.setState(state => ({
            ...state,
            expanded: !state.expanded
        }))
    }

    render() {
        const tags = this.state.expanded ? this.state.tags.slice(0) : this.state.tags.slice(0, this.state.count)

        return (
            <div className={"tags-wrapper " + (this.state.expanded ? "expanded" : "") }>

                {/*<Img src="tag.svg" className="tags-icon icon"/>*/}

                <div className="tag-items">

                    {tags.map(tag => (
                        <div className="tag-item">
                            <span>{tag}</span>
                            <Img src="delete.svg" className="delete-tag-btn" onClick={() => this.deleteTag(tag)}/>
                        </div>
                    ))}

                    <div className="asdf">
                        {
                            this.state.tags.length > this.state.count && !this.state.expanded ?
                                <div className="tag-item"><span>+{(this.state.tags.length - this.state.count).toString()}</span></div> : ""
                        }
                    </div>

                    <input type="text" placeholder="Введите тэг" value={this.state.value} oninput={this.setValue}  onkeyup={this.onInput} ref={ref => this.inputRef = ref}/>

                </div>

                <div className="mock">

                </div>

                <Img src="expand.svg" className="expand-btn" onClick={this.toggleExpanded}/>

            </div>
        )
    }
}