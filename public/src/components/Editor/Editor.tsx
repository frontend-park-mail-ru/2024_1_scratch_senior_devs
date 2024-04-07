import {Component} from "@veglem/screact/dist/component";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Block, BlockNode, BlockProps} from "../Block/Block";
import {AppNoteStore, NoteStoreActions} from "../../modules/stores/NoteStore";
import {getBlockHash} from "../../utils/hash";
import {debounce} from "../../utils/debauncer";
import {AppDispatcher} from "../../modules/dispatcher";
import "./editor.sass"
import {Dropdown} from "../Dropdown/Dropdown";

export interface Note {
    title: string,
    blocks: Array<BlockNode>
}

type EditorState = {
    blocks: number
}

export class Editor extends Component<any, EditorState> {
    state = {
        blocks: 0,
        dropdownOpen: false
    }

    componentDidMount() {
        AppNoteStore.SubscribeToStore(this.updateState)
        this.setState(s => {
            return {...s, blocks: AppNoteStore.state.note.blocks.length}
        })
        document.onselectionchange = (e) => {
            if (document.getSelection().isCollapsed === false) {
                const r = /piece-(\d+)-(\d+)/;
                const matchesAnchor = r.exec(document.getSelection().anchorNode.parentElement.id.toString())
                const matchesFocus = r.exec(document.getSelection().focusNode.parentElement.id.toString())
                if (matchesAnchor != null && matchesFocus != null) {
                    debounce(() => {
                        console.log(`anchor - ${matchesAnchor[1]} - ${matchesAnchor[2]} | focus - ${matchesFocus[1]} - ${matchesFocus[2]}`)
                    }, 1000)()
                }
            }
        }
    }

    updateState = (store) => {
        this.setState(state => ({
            ...state,
            dropdownOpen: store.dropdownPos.isOpen,
            blocks: store.note.blocks.length
        }))
    }

    closeEditor = () => {
        console.log("closeEditor")
        AppDispatcher.dispatch(NoteStoreActions.CLOSE_DROPDOWN)

        this.setState(state => ({
            ...state,
            dropdownOpen: false
        }))
    }

    private renderBlocks = () => {
        const result = Array<VDomNode>();
        for (let i = 0; i < this.state.blocks; ++i) {
            result.push(
                <div className={"drag-area"}
                     ondrop={(e) => {
                         console.log(e.dataTransfer.getData("blockId"), i)
                         e.target.classList.remove("active")
                         AppDispatcher.dispatch(NoteStoreActions.MOVE_BLOCK, {
                            blockId: Number(e.dataTransfer.getData("blockId")),
                            posToMove: i
                         })
                     }}
                     ondragover={(e)=>{
                         e.preventDefault();
                     }}
                     ondragenter={(e) => {e.target.classList.add("active")}}
                     ondragleave={(e)=>{e.target.classList.remove("active")}}
                ></div>
            )
            result.push(
                <Block
                    key1={AppNoteStore.state.note.blocks[i].id}
                    blockId={i}
                    blockHash={getBlockHash(AppNoteStore.state.note.blocks[i])}
                    isChosen={AppNoteStore.state.cursorPosition != null && AppNoteStore.state.cursorPosition.blockId == i}
                ></Block>
            )
        }
        result.push(<div className={"drag-area"}
                         ondrop={(e) => {
                             console.log(e.dataTransfer.getData("blockId"), this.state.blocks)
                             e.target.style.border = "none"
                             AppDispatcher.dispatch(NoteStoreActions.MOVE_BLOCK, {
                                 blockId: Number(e.dataTransfer.getData("blockId")),
                                 posToMove: this.state.blocks
                             })
                         }}
                         ondragover={(e) => {
                             e.preventDefault();
                         }}
                         ondragenter={(e) => {e.target.style.border = "1px solid blue"}}
                         ondragleave={(e)=>{e.target.style.border = "none"}}
        ></div>)
        return result;
    }

    render(): VDomNode {
        console.log(`left: ${AppNoteStore.state.dropdownPos.left}; top: ${AppNoteStore.state.dropdownPos.top};`);
        return (
            <div className="note-editor">
                <div className="note-title-container">
                    <h3 className="note-title">{AppNoteStore.state.note.title}</h3>
                </div>
                <div className="note-body-container">
                    {this.renderBlocks()}
                </div>
                <Dropdown blockId={AppNoteStore.state.dropdownPos.blockId}
                          style={`left: ${AppNoteStore.state.dropdownPos.left}px; top: ${AppNoteStore.state.dropdownPos.top}px;`}
                          onClose={this.closeEditor}
                          open={this.state.dropdownOpen}
                />
            </div>
        )
    }
}