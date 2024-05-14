import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./TagsFilter.sass"
import {Modal} from "../Modal/Modal";
import {DeleteTagDialog} from "../DeleteTagDialog/DeleteTagDialog";
import {RenameTagModal} from "../RenameTagModal/RenameTagModal";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";

type TagsFilterProps = {
    tags: string[],
    selectedTags: string[],
    selectTag: (tag:string) => void
}

type TagsFilterState = {
    expanded: boolean,
    menuOpen: boolean,
    deleteTagDialogOpen: boolean,
    renameTagModalOpen: boolean,
    selectedTag: string
}

export class TagsFilter extends ScReact.Component<TagsFilterProps, TagsFilterState> {
    state = {
        expanded: false,
        menuOpen: false,
        deleteTagDialogOpen: false,
        renameTagModalOpen: false,
        selectedTag: null
    }

    private menuRef

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
        console.log("closeMenu")
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

        this.menuRef.style.left = e.target.offsetLeft + "px"
        this.menuRef.style.top = (e.target.offsetTop - e.target.parentElement.scrollTop + 40) + "px"

        return false
    }

    deleteTag = () => {
        console.log("dispatch")
        AppDispatcher.dispatch(NotesActions.DELETE_TAG, this.state.selectedTag)

        this.setState(state => ({
            ...state,
            selectedTag: null
        }))
    }

    renameTag = () => {
        // TODO
    }

    openDeleteTagModalDialog = () => {
        this.setState(state => ({
            ...state,
            deleteTagDialogOpen: true
        }))
    }

    closeDeleteTagDialog = () => {
        this.setState(state => ({
            ...state,
            deleteTagDialogOpen: false
        }))
    }

    openRenameTagModal= () => {
        this.setState(state => ({
            ...state,
            renameTagModalOpen: true
        }))
    }

    closeRenameTagModal = () => {
        this.setState(state => ({
            ...state,
            renameTagModalOpen: false
        }))
    }

    render() {
        const tags = this.state.expanded ? this.props.tags : this.props.tags.slice(0, 10)

        return (
            <div className="filters-wrapper">

                <Modal
                    open={this.state.deleteTagDialogOpen}
                    handleClose={this.closeDeleteTagDialog}
                    content={<DeleteTagDialog onSuccess={this.deleteTag} handleClose={this.closeDeleteTagDialog} />}
                />
                
                <Modal
                    open={this.state.renameTagModalOpen}
                    handleClose={this.closeRenameTagModal}
                    content={<RenameTagModal onSuccess={this.renameTag} tag={this.state.selectedTag} handleClose={this.closeRenameTagModal} />}
                />
                
                <div className="filters-panel" onscroll={this.closeMenu}>
                    <div className="tag-icon-container">
                        <Img src="tag.svg" className="icon"/>
                    </div>

                    <div className={"tag-options-menu " + (this.state.menuOpen ? "open" : "")} ref={ref => this.menuRef = ref}>
                        <div className="tag-options-menu__option" onclick={this.openRenameTagModal}>
                            <Img src="edit.svg"/>
                            <span>Изменить</span>
                        </div>
                        <div className="tag-options-menu__option" onclick={this.openDeleteTagModalDialog}>
                            <Img src="trash.svg"/>
                            <span>Удалить</span>
                        </div>
                    </div>

                    {tags.map(tag => (
                        <div className={"tag " + (this.props.selectedTags.includes(tag) || this.state.selectedTag == tag ? "selected" : "")}
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