import {Component} from "@veglem/screact/dist/component";
import {Piece, PieceNode} from "../Piece/Piece";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {ScReact} from "@veglem/screact";
import {AppNoteStore, NoteStoreActions} from "../../modules/stores/NoteStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {getPieceHash} from "../../utils/hash";
import "./block.sass"
import {renderUlPrefix} from "./utils/ul";
import {renderOlPrefix} from "./utils/ol";
import {getCursorInBlock, setCursorInBlock} from "../../utils/cursorPos";
import {moveCursorUpAndDown} from "./utils/cursorActions";

export interface BlockNode {
    id: string
    type: string,
    content?: Array<PieceNode>,
    attributes?: object
}

export type BlockState = {
    piecesCount: number
}

export type BlockProps = {
    blockId: number
    blockHash: number
    isChosen: boolean
}

export class Block extends Component<BlockProps, BlockState> {
    state = {
        piecesCount: 0,
        dragBtnActive: false,
        dragged: false
    }

    renderPrevSymbol = (): VDomNode[] => {
        // const block = AppNoteStore.state.note.blocks[this.props.blockId]
        const pieces: Array<VDomNode> = [];
        const block = AppNoteStore.state.note.blocks[this.props.blockId];
        if (block.attributes != null &&
            "file" in block.attributes) {
            return [<a href={block.attributes.file} download>File</a>]
        }
        renderUlPrefix(block, pieces);
        renderOlPrefix(block, this.props.blockId, pieces);
        return pieces;
    }

    renderChildren = () => {
        if (AppNoteStore.state.note.blocks[this.props.blockId].content !== undefined) {
            const pieces = Array<VDomNode>();
            for (let i = 0; i < AppNoteStore.state.note.blocks[this.props.blockId].content.length; ++i) {
                pieces.push(<Piece
                    blockId={this.props.blockId}
                    pieceId={i}
                    pieceHash={getPieceHash(AppNoteStore.state.note.blocks[this.props.blockId].content[i])}
                ></Piece>)
            }
            console.log(pieces)
            return pieces;
        } else {
            const pieces = Array<VDomNode>();
            pieces.push(<br/>)
            return pieces as VDomNode[]
        }
    }

    private self: HTMLElement

    componentDidUpdate() {
        setCursorInBlock(this.self, this.props.blockId);
    }

    componentDidMount() {
        this.setState(s => {
            return {...s, piecesCount: AppNoteStore.state.note.blocks[this.props.blockId].content?.length}
        })
    }

    private contener: HTMLElement

    render(): VDomNode {
        return (
            <div
                className="block"
                style={"width: 100%;"}
                ref={(elem) => {this.contener = elem}}
                ondragend={() => {this.contener.draggable = false}}
                ondragstart={(e) => {e.dataTransfer.setData("blockId", this.props.blockId.toString())}}
            >

                <img
                    src="src/assets/drag-btn.svg"
                    alt=""
                    className={"drag-btn " + (this.state.dragBtnActive ? "" : "hide")}
                     key1={"move-btn"}
                     onmousedown={() => {this.contener.draggable = true}} />

                <div
                    className="piece-container"
                    onmouseover={() => {this.setState(state => ({...state, dragBtnActive: true}))}}
                    onmouseleave={() => {this.setState(state => ({...state, dragBtnActive: false}))}}
                >
                    {this.renderPrevSymbol()}
                    {ScReact.createElement(AppNoteStore.state.note.blocks[this.props.blockId].type, {
                            key: "peices",
                            ...AppNoteStore.state.note.blocks[this.props.blockId].attributes,
                            contentEditable: true,
                            ref: (elem: HTMLElement) => {
                                this.self = elem
                            },
                            className: "editablediv",
                            style: "display: inline;",
                            oninput: (e: InputEvent) => {
                                e.preventDefault();
                                if ("inputType" in e) {
                                    if (AppNoteStore.state.note.blocks[this.props.blockId].type == "div" &&
                                        (AppNoteStore.state.note.blocks[this.props.blockId].attributes == null ||
                                            !("ol" in AppNoteStore.state.note.blocks[this.props.blockId].attributes) &&
                                            !("ul" in AppNoteStore.state.note.blocks[this.props.blockId].attributes)) &&
                                        (e.target as HTMLElement).textContent == "/") {
                                        const elem = e.target as HTMLElement;
                                        AppDispatcher.dispatch(NoteStoreActions.OPEN_DROPDOWN, {
                                            blockPos: elem.getBoundingClientRect(),
                                            blockId: this.props.blockId
                                        })
                                    }
                                    if (e.inputType == "insertText") {
                                        const elem  = e.target as HTMLElement;
                                        if (elem.childNodes.length === 1 && elem.childNodes[0].nodeName === "#text") {
                                            const text = elem.childNodes[0].textContent;
                                            const s = document.createElement("span");
                                            this.self.childNodes[0].remove();
                                            AppDispatcher.dispatch(NoteStoreActions.ADD_NEW_PIECE, {
                                                blockId: this.props.blockId,
                                                insertPosition: 0,
                                                content: text
                                            })
                                            return
                                        }
                                    }
                                    const elemPieces = Array<{pieceId: string, content: string}>()

                                    const elem = e.target as HTMLElement;

                                    for (let i = 0; i < elem.children.length; ++i) {
                                        const r = /piece-(\d+)-(\d+)/;
                                        const matches = r.exec(elem.children[i].id.toString())

                                        if (matches != null) {
                                            elemPieces.push({
                                                pieceId: i.toString(),
                                                content: elem.children[i].textContent.replace("\n", "")
                                            })
                                        }
                                    }

                                    const cursorPosition = getCursorInBlock(this.self)

                                    AppDispatcher.dispatch(NoteStoreActions.CHANGE_PIECE, {
                                        blockId: this.props.blockId,
                                        pieces: elemPieces,
                                        posOffset: cursorPosition
                                    })

                                    if (elemPieces.length == 0) {
                                        moveCursorUpAndDown(this.props.blockId);
                                    }

                                    console.log(elemPieces, cursorPosition)
                                }
                            },
                            onkeydown: (e: Event) => {
                                if ("key" in e && e.key === "Enter") {
                                    e.preventDefault();
                                    AppDispatcher.dispatch(NoteStoreActions.ADD_BLOCK, {insertPos: this.props.blockId + 1});
                                    const block = AppNoteStore.state.note.blocks[this.props.blockId];
                                    if (block.attributes != null &&
                                        "ul" in block.attributes &&
                                        block.attributes.ul == true) {
                                        setTimeout(()=> {
                                            const newBlock = AppNoteStore.state.note.blocks[this.props.blockId + 1];
                                            newBlock.attributes = {}
                                            newBlock.attributes["ul"] = true;
                                            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                blockId: this.props.blockId,
                                                pos: 0
                                            })
                                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {blockId: this.props.blockId + 1, newBlock: newBlock})
                                            setTimeout(()=> {
                                                AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                    blockId: this.props.blockId + 1,
                                                    pos: 0
                                                })
                                            })
                                        })
                                    }
                                    if (block.attributes != null &&
                                        "ol" in block.attributes &&
                                        block.attributes.ol == true) {
                                        setTimeout(()=> {
                                            const newBlock = AppNoteStore.state.note.blocks[this.props.blockId + 1];
                                            newBlock.attributes = {}
                                            newBlock.attributes["ol"] = true;
                                            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                blockId: this.props.blockId,
                                                pos: 0
                                            })
                                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {blockId: this.props.blockId + 1, newBlock: newBlock})
                                            setTimeout(()=> {
                                                AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                    blockId: this.props.blockId + 1,
                                                    pos: 0
                                                })
                                            })
                                        })
                                    }
                                }
                                if ("key" in e && e.key === "Backspace" &&
                                    (AppNoteStore.state.note.blocks[this.props.blockId].content == null ||
                                        AppNoteStore.state.note.blocks[this.props.blockId].content.length === 0)) {
                                    e.preventDefault()
                                    const block = AppNoteStore.state.note.blocks[this.props.blockId];
                                    if (block.type !== "div") {
                                        block.type = "div";
                                        block.attributes = null;
                                        block.content = []
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {blockId: this.props.blockId, newBlock: block})
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        "ul" in block.attributes &&
                                        block.attributes.ul == true) {
                                        delete block.attributes.ul
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {blockId: this.props.blockId, newBlock: block})
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        "ol" in block.attributes &&
                                        block.attributes.ol == true) {
                                        delete block.attributes.ol
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {blockId: this.props.blockId, newBlock: block})
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        "file" in block.attributes) {
                                        delete block.attributes.file
                                        block.content = [];
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {blockId: this.props.blockId, newBlock: block})
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    AppDispatcher.dispatch(NoteStoreActions.REMOVE_BLOCK, {delPos: this.props.blockId})
                                    return;
                                }
                                if ("key" in e && e.key === "ArrowDown") {
                                    e.preventDefault();
                                    let cursorPosition = 0;
                                    if (AppNoteStore.state.note.blocks[this.props.blockId].content != null) {
                                        const selection = window.getSelection();
                                        const range = selection.getRangeAt(0);
                                        const clonedRange = range.cloneRange();
                                        clonedRange.selectNodeContents(this.self);
                                        clonedRange.setEnd(range.endContainer, range.endOffset);

                                        cursorPosition = clonedRange.toString().length;
                                    }

                                    AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                        blockId: this.props.blockId + 1,
                                        pos: cursorPosition
                                    })
                                }
                                if ("key" in e && e.key === "ArrowUp") {
                                    e.preventDefault();
                                    const selection = window.getSelection();
                                    const range = selection.getRangeAt(0);
                                    const clonedRange = range.cloneRange();
                                    clonedRange.selectNodeContents(this.self);
                                    clonedRange.setEnd(range.endContainer, range.endOffset);

                                    const cursorPosition = clonedRange.toString().length;
                                    AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                        blockId: this.props.blockId - 1,
                                        pos: cursorPosition
                                    })
                                }

                            },
                            onpaste: (e) => {
                                e.preventDefault()
                                const selection = window.getSelection();
                                const range = selection.getRangeAt(0);
                                const clonedRange = range.cloneRange();
                                clonedRange.selectNodeContents(this.self);
                                clonedRange.setEnd(range.endContainer, range.endOffset);

                                const cursorPosition = clonedRange.toString().length;

                                const pieces: {content: string, pieceId: string}[] = [];

                                if (AppNoteStore.state.note.blocks[this.props.blockId].content.length === 0) {
                                    pieces.push({
                                        pieceId: "0",
                                        content: e.clipboardData.getData("text").replace("\n", "")
                                    })

                                    AppDispatcher.dispatch(NoteStoreActions.ADD_NEW_PIECE, {
                                        blockId: this.props.blockId,
                                        insertPosition: 0,
                                        content: e.clipboardData.getData("text").replace("\n", "")
                                    })
                                    return
                                }

                                let offset = 0;
                                AppNoteStore.state.note.blocks[this.props.blockId].content.forEach((piece, i) => {
                                    if (piece.content.length + offset < cursorPosition) {
                                        offset += piece.content.length;
                                        pieces.push({
                                            pieceId: i.toString(),
                                            content: piece.content
                                        })
                                    } else if (cursorPosition - offset < piece.content.length) {
                                        pieces.push({
                                            pieceId: i.toString(),
                                            content: piece.content.substring(0,cursorPosition - offset) +
                                                e.clipboardData.getData("text") +
                                                piece.content.substring(cursorPosition - offset)
                                        })

                                        offset += piece.content.length;
                                    }
                                })

                                AppDispatcher.dispatch(NoteStoreActions.CHANGE_PIECE, {
                                    blockId: this.props.blockId,
                                    pieces: pieces,
                                    posOffset: cursorPosition + e.clipboardData.getData("text").length
                                })

                            }
                        },
                        ...this.renderChildren()
                    )}
                </div>

            </div>
        )
    }
}