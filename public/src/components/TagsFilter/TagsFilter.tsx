import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./TagsFilter.sass"

type TagsFilterProps = {
    tags: string[],
    selectedTags: string[],
    selectTag: (tag:string) => void
}

type TagsFilterState = {
    expanded: boolean,
    menuOpen: boolean,
    selectedTag: string
}

export class TagsFilter extends ScReact.Component<TagsFilterProps, TagsFilterState> {
    state = {
        expanded: false,
        menuOpen: false,
        selectedTag: null
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (e) => {
        if (this.state.menuOpen && !e.target.matches(".tag")) {
            this.closeMenu();
        }
    }

    toggleExpanded = () => {
        this.setState(state => ({
            ...state,
            menuOpen: false,
            expanded: !state.expanded
        }))
    }

    closeMenu = () => {
        this.setState(state => ({
            ...state,
            menuOpen: false
        }))
    }

    onTagRightClick = (e, tag:string) => {
        e.preventDefault()

        this.setState(state => ({
            ...state,
            selectedTag: tag,
            menuOpen: true
        }))

        return false
    }

    deleteTag = () => {
        console.log("deleteTag")
        console.log(this.state.selectedTag)
        // TODO
    }

    render() {
        const tags = this.state.expanded ? this.props.tags : this.props.tags.slice(0, 10)

        return (
            <div className="filters-wrapper">
                <div className="filters-panel">
                    <div className="tag-icon-container">
                        <Img src="tag.svg" className="icon"/>
                    </div>

                    <div className={"tag-options-menu " + (this.state.menuOpen ? "open" : "")}>
                        <div className="tag-options-menu__option" onclick={this.deleteTag}>
                            <Img src="edit.svg"/>
                            <span>Изменить</span>
                        </div>
                        <div className="tag-options-menu__option" onclick={this.deleteTag}>
                            <Img src="trash.svg"/>
                            <span>Удалить</span>
                        </div>
                    </div>

                    {tags.map(tag => (
                        <div className={"tag " + (this.props.selectedTags.includes(tag) ? "selected" : "")}
                             onclick={() => this.props.selectTag(tag)} oncontextmenu={(e) => this.onTagRightClick(e, tag)}>
                            {tag}
                        </div>
                    ))}


                    {this.props.tags.length > 10 && !this.state.expanded ? <div className="tag"
                                                                                onclick={this.toggleExpanded}>+{(this.props.tags.length - 10).toString()}</div> : ""}
                    {this.state.expanded ?
                        <div className="tag hide-btn" onclick={this.toggleExpanded}>Скрыть</div> : ""}
                </div>
            </div>
        )
    }
}