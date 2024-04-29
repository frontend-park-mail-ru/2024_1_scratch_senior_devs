import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./TagsFilter.sass"

type TagsFilterProps = {
    tags: string[],
    selectedTags: string[],
    selectTag: (tag:string) => void
}

export class TagsFilter extends ScReact.Component<TagsFilterProps, any> {
    state = {
        expanded: false
    }

    toggleExpanded = () => {
        this.setState(state => ({
            ...state,
            expanded: !state.expanded
        }))
    }

    render() {
        const tags = this.state.expanded ? this.props.tags : this.props.tags.slice(0, 10)

        return (
            <div className="filters-panel">
                <div className="tag-icon-container">
                    <Img src="tag.svg" className="icon"/>
                </div>
                {tags.map(tag => (
                    <div className={"tag " + (this.props.selectedTags.includes(tag) ? "selected" : "")} onclick={() => this.props.selectTag(tag)}>
                        {tag}
                    </div>
                ))}
                {this.props.tags.length > 10 && !this.state.expanded ? <div className="tag" onclick={this.toggleExpanded}>+{(this.props.tags.length - 10).toString()}</div> : ""}
                {this.state.expanded ? <div className="tag hide-btn" onclick={this.toggleExpanded}>Скрыть</div> : ""}
            </div>
        )
    }
}