import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./TagsFilter.sass"
import {Modal} from "../Modal/Modal";
import {DeleteTagDialog} from "../DeleteTagDialog/DeleteTagDialog";
import {RenameTagModal} from "../RenameTagModal/RenameTagModal";
import {AppDispatcher} from "../../modules/dispatcher";
import {NotesActions} from "../../modules/stores/NotesStore";
import {AddTagMenu} from "../AddTagMenu/AddTagMenu";
import {AppToasts} from "../../modules/toasts";

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

    componentDidUpdate() {
        if (this.state.expanded && this.props.tags.length <= 10) {
            this.toggleExpanded()
        }
    }

    handleClickOutside = (e) => {
        if (this.state.renameTagModalOpen || this.state.deleteTagDialogOpen) {
            return
        }

        if (!this.state.menuOpen) {
            this.setState(state => ({
                ...state,
                selectedTag: null
            }))

            return
        }

        if (this.menuRef.contains(e.target)) {
            this.setState(state => ({
                ...state,
                menuOpen: false
            }))
        } else {
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
            selectedTag: null,
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
        AppDispatcher.dispatch(NotesActions.DELETE_TAG, this.state.selectedTag)

        this.setState(state => ({
            ...state,
            selectedTag: null
        }))
    }

    renameTag = (new_name:string) => {
        AppDispatcher.dispatch(NotesActions.RENAME_TAG, {
            old_name: this.state.selectedTag,
            new_name: new_name
        })

        this.setState(state => ({
            ...state,
            selectedTag: null,
            renameTagModalOpen: false
        }))
    }

    openDeleteTagModalDialog = () => {
        this.setState(state => ({
            ...state,
            menuOpen: false,
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
            menuOpen: false,
            renameTagModalOpen: true
        }))
    }

    closeRenameTagModal = () => {
        this.setState(state => ({
            ...state,
            renameTagModalOpen: false
        }))
    }

    private longpress = false;
    private presstimer = null;

    click = (tag) => {
        console.log('click')
        console.log(this.state.menuOpen)

        if (this.presstimer !== null) {
            clearTimeout(this.presstimer);
            this.presstimer = null;
        }

        if (this.longpress) {
            return false;
        }

        if (!this.state.menuOpen) {
            this.props.selectTag(tag)
        }
    }

    start = (e, tag)=> {
        console.log(e);

        if (e.type === "click" && e.button !== 0) {
            return;
        }

        this.longpress = false;

        this.presstimer = setTimeout(() => {
            console.log("long click");
            this.onTagRightClick(e, tag)
            this.longpress = true;
        }, 1000);

        return false;
    };

    cancel = (e) => {
        console.log("cancel")
        if (this.presstimer !== null) {
            clearTimeout(this.presstimer);
            this.presstimer = null;
        }
    };

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
                    content={<RenameTagModal onSuccess={this.renameTag} tag={this.state.selectedTag} tags={this.props.tags} handleClose={this.closeRenameTagModal} />}
                />

                <div className="filters-panel" onscroll={this.closeMenu}>

                    <AddTagMenu tags={this.props.tags}/>

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
                        <div
                            className={"tag " + (this.props.selectedTags.includes(tag) || this.state.selectedTag == tag ? "selected" : "")}
                            onclick={() =>this.click(tag)}
                            oncontextmenu={(e) => this.onTagRightClick(e, tag)}
                            onmousedown={(e) => this.start(e, tag)}
                            ontouchstart={(e) => this.start(e, tag)}
                            onmouseout={this.cancel}
                            ontouchend={this.cancel}
                            ontouchleave={this.cancel}
                            ontouchcancel={this.cancel}
                            >
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