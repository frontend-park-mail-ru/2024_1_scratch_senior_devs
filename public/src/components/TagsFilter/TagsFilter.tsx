import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./TagsFilter.sass"

type TagsFilterProps = {
    tags: string[],
    selectedTags: string[],
    selectTag: (tag:string) => void
}

export class TagsFilter extends ScReact.Component<TagsFilterProps, any> {
    render() {
        return (
            <div className="filters-panel">
                <div className="tag-icon-container">
                    <Img src="tag.svg" className="icon"/>
                </div>
                {this.props.tags.map(tag => (
                    <div className={"tag " + (this.props.selectedTags.includes(tag) ? "selected" : "")} onclick={() => this.props.selectTag(tag)}>
                        {tag}
                    </div>
                ))}
            </div>
        )
    }
}