import {BaseStore} from "./BaseStore";
import {Note} from "../../components/Editor/Editor";
import {AppDispatcher} from "../dispatcher";
import {Block, BlockNode} from "../../components/Block/Block";
import {create_UUID} from "../../utils/uuid";
import {PieceNode} from "../../components/Piece/Piece";
import {AppNotesStore, NotesActions} from './NotesStore';

export const NoteStoreActions = {
    CHANGE_PIECE: "CHANGE_PIECE",
    REMOVE_PIECE: "REMOVE_PIECE",
    ADD_NEW_PIECE: "ADD_PIECE",
    CHANGE_BLOCK: "CHANGE_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    ADD_BLOCK: "ADD_BLOCK",
    MOVE_CURSOR: "MOVE_CURSOR",
    MOVE_BLOCK: "MOVE_BLOCK",
    OPEN_DROPDOWN: "OPEN_DROPDOWN",
    CLOSE_DROPDOWN: "CLOSE_DROPDOWN",
    CHANGE_BLOCK_TYPE: "CHANGE_BLOCK_TYPE",
    CHANGE_TITLE: "CHANGE_TITLE",
    CHANGE_PIECE_ATTRIBUTES: "CHANGE_PIECE_ATTRIBUTES"
}

export type NoteStoreState = {
    note: Note,
    cursorPosition?: CursorPosition
    dropdownPos: DropdownPosition
}

export type CursorPosition = {
    blockId: number,
    pos: number
}

export type DropdownPosition = {
    left: number,
    top: number,
    isOpen: boolean,
    blockId: number
}

class NoteStore extends BaseStore<NoteStoreState> {
    state = {
        note: {
            title: "",
            blocks: Array<BlockNode>()
        },
        cursorPosition: null,
        dropdownPos: {
            left: 0,
            top: 0,
            isOpen: false,
            blockId: 0
        }
    }

    private severs: Array<() => any> = []

    constructor() {
        super();
        this.registerEvents();
    }

    private registerEvents = () => {
        AppDispatcher.register((action) => {
            switch (action.type) {
                case NoteStoreActions.CHANGE_PIECE:
                    this.changePiece(action.payload.blockId, action.payload.pieces, action.payload.posOffset);
                    break;
                case NoteStoreActions.REMOVE_PIECE:
                    // this.removePiece(action.payload.blockId, action.payload.pieceId);
                    break;
                case NoteStoreActions.ADD_NEW_PIECE:
                    this.addNewPiece(action.payload.blockId, action.payload.insertPosition, action.payload.content);
                    break;
                case NoteStoreActions.ADD_BLOCK:
                    this.addNewBlock(action.payload.insertPos);
                    break
                case NoteStoreActions.REMOVE_BLOCK:
                    this.deleteBlock(action.payload.delPos);
                    break;
                case NoteStoreActions.MOVE_CURSOR:
                    this.moveCursor(action.payload.blockId, action.payload.pos);
                    break;
                case NoteStoreActions.CHANGE_BLOCK:
                    this.changeBlock(action.payload.blockId, action.payload.newBlock);
                    break;
                case NoteStoreActions.MOVE_BLOCK:
                    this.moveBlock(action.payload.blockId, action.payload.posToMove);
                    break;
                case NoteStoreActions.OPEN_DROPDOWN:
                    this.openDropdown(action.payload.blockPos, action.payload.blockId);
                    break;
                case NoteStoreActions.CLOSE_DROPDOWN:
                    this.closeDropdown();
                    break;
                case NoteStoreActions.CHANGE_BLOCK_TYPE:
                    this.changeBlockType(action.payload.blockId, action.payload.tag, action.payload.attributes, action.payload.content)
                    break;
                case NoteStoreActions.CHANGE_TITLE:
                    this.changeTitle(action.payload.title);
                    break;
                case NoteStoreActions.CHANGE_PIECE_ATTRIBUTES:
                    this.changePieceAttributes(action.payload.blockId, action.payload.anchorId, action.payload.focusId, action.payload.anchorPos, action.payload.focusPos, action.payload.attribute, action.payload.value);
                    break;
            }
        })
    }

    private timerId: NodeJS.Timeout = setTimeout(() => {
    })

    private saveNote = () => {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.severs.forEach((saver) => {
                saver();
            })
        }, 1000)
    }

    public AddSaver = (saver: () => any) => {
        this.severs.push(saver);
    }

    public RemoveSavers = (saver: () => any) => {
        this.severs = [];
    }

    public SetNote = (note: Note) => {
        this.SetState(s => {
            return {...s, note: note};
        })
    }

    private changePiece = (blockId: number, pieces: { pieceId: string, content: string }[], posOffset: number) => {
        if (pieces.length > 0 &&
            !pieces[0].content.startsWith("/")) {
            this.closeDropdown();
        }
        const oldNote: Note = this.state.note;
        const newBlockContent = new Array<PieceNode>()
        pieces.forEach(piece => {
            newBlockContent.push({
                id: oldNote.blocks[blockId].content[piece.pieceId].id,
                content: piece.content,
                attributes: oldNote.blocks[blockId].content[piece.pieceId].attributes
            })
        })
        oldNote.blocks[blockId].content = newBlockContent;
        this.state.note = oldNote;
        this.state.cursorPosition = {
            blockId: blockId,
            pos: posOffset
        }
        this.saveNote();
        // this.SetState(s => {
        //     const oldNote: Note = this.state.note;
        //     const newBlockContent = new Array<PieceNode>()
        //     pieces.forEach(piece => {
        //         newBlockContent.push({
        //             id: oldNote.blocks[blockId].content[piece.pieceId].id,
        //             content: piece.content,
        //             attributes: oldNote.blocks[blockId].content[piece.pieceId].attributes
        //         })
        //     })
        //     oldNote.blocks[blockId].content = newBlockContent;
        //     console.log(oldNote)
        //     return {...s, note: oldNote, cursorPosition: {blockId: blockId, pos: posOffset}}
        // })
    }

    private addNewPiece = (blockId: number, insertPosition: number, content: string) => {
        this.SetState(s => {
            const oldNote: Note = this.state.note;
            oldNote.blocks[blockId].content.splice(insertPosition, 0, {
                content: content,
                id: create_UUID(),
                attributes: null,
            })
            return {...s, note: oldNote, cursorPosition: {blockId: blockId, pos: content.length}}
        })
        this.saveNote();
    }

    private addNewBlock = (insertPos: number) => {
        this.closeDropdown();
        this.SetState(s => {
            const oldNote: Note = this.state.note;
            oldNote.blocks.splice(insertPos, 0, {
                content: [],
                attributes: null,
                id: create_UUID(),
                type: "div"
            })

            return {...s, note: oldNote, cursorPosition: {blockId: insertPos, pos: 0}}
        })
        this.saveNote();
    }

    private deleteBlock = (delPos: number) => {
        this.closeDropdown();
        if (delPos == 0) {
            return
        }
        this.SetState(s => {
            const oldNote: Note = this.state.note;
            oldNote.blocks.splice(delPos, 1)
            const pos = this.state.note.blocks[delPos - 1].content?.reduce((prev: number, curr: PieceNode, i: number) => {
                prev += curr.content.length
                return prev
            }, 0)
            return {...s, note: oldNote, cursorPosition: {blockId: delPos - 1, pos: pos}}
        })
        this.saveNote();
    }

    private moveCursor = (blockId: number, pos: number) => {
        this.closeDropdown();
        if (blockId < 0 || blockId >= this.state.note.blocks.length) {
            return
        }
        this.SetState(s => {
            const maxPos = this.state.note.blocks[blockId].content?.reduce((prev: number, curr: PieceNode, i: number) => {
                prev += curr.content.length
                return prev
            }, 0)
            const posToSet = Math.min(maxPos, pos);
            return {...s, cursorPosition: {blockId: blockId, pos: posToSet}}
        })
    }

    private changeBlock = (blockId: number, newBlock: BlockNode) => {
        this.closeDropdown();
        this.SetState(s => {
            const oldNote: Note = this.state.note;
            oldNote.blocks[blockId] = newBlock;
            return {...s, note: oldNote}
        })
        this.saveNote();
    }

    private moveBlock = (blockId: number, posToMove: number) => {
        if (blockId == posToMove) {
            return
        }
        this.SetState(s => {
            const oldNote: Note = this.state.note;
            if (blockId > posToMove) {
                oldNote.blocks.splice(posToMove, 0, oldNote.blocks[blockId]);
                oldNote.blocks.splice(blockId + 1, 1);
                return {...s, note: oldNote}
            } else {
                oldNote.blocks.splice(posToMove, 0, oldNote.blocks[blockId]);
                oldNote.blocks.splice(blockId, 1);
                return {...s, note: oldNote}
            }
        })
        this.saveNote();
    }

    private openDropdown = (blockPos: DOMRect, blockId: number) => {
        if (blockPos.y > 250) {
            this.SetState(s => {
                return {...s, dropdownPos: {left: blockPos.x, top: blockPos.y - 240, isOpen: true, blockId: blockId}}
            })
        } else {
            this.SetState(s => {
                return {...s, dropdownPos: {left: blockPos.x, top: blockPos.y + 31, isOpen: true, blockId: blockId}}
            })
        }
    }

    private closeDropdown = () => {
        console.log("closeDropdown")
        // this.SetState(state => {
        //     return {
        //         ...state,
        //         dropdownPos: {...state.dropdownPos, isOpen: false}
        //     }
        // })
        this.state.dropdownPos.isOpen = false;
    }

    private changeBlockType = (blockId: number, tag: string, attributes?: object, content?: PieceNode[]) => {
        this.closeDropdown();
        this.SetState(s => {
            const oldNote = this.state.note;
            oldNote.blocks[blockId].type = tag;
            oldNote.blocks[blockId].attributes = attributes;
            oldNote.blocks[blockId].content = content;
            return {...s, note: oldNote}
        })
        this.saveNote();
    }

    private changeTitle = (title: string) => {
        this.closeDropdown();

        this.state.note.title = title;
        this.saveNote();
    }

    private timerIdPiece: NodeJS.Timeout = setTimeout(() => {
    })

    private changePieceAttributes = (blockId: number, anchorId: number, focusId: number, anchorPos: number, focusPos: number, attribute: string, value?: string | number | boolean | undefined) => {
        console.log("value", value)
        const block = AppNoteStore.state.note.blocks[blockId];
        let minPiece = 0;
        let minPos = 0;
        let maxPiece = 0;
        let maxPos = 0;
        if (anchorId > focusId) {
            minPiece = focusId;
            minPos = focusPos;
            maxPiece = anchorId;
            maxPos = anchorPos;
        } else if (anchorId < focusId) {
            minPiece = anchorId;
            minPos = anchorPos;
            maxPiece = focusId;
            maxPos = focusPos;
        } else {
            minPiece = anchorId;
            minPos = Math.min(anchorPos, focusPos);
            maxPiece = focusId;
            maxPos = Math.max(anchorPos, focusPos);
        }

        const pieces: PieceNode[] = [];

        const beforePieces: PieceNode[] = [];
        const modifyPieces: PieceNode[] = [];
        const afterPieces: PieceNode[] = [];

        block.content.forEach((val, index) => {
            if (index < minPiece) {
                beforePieces.push(val);
            } else if (index > minPiece && index < maxPiece) {
                modifyPieces.push(val);
            } else if (index > maxPiece) {
                afterPieces.push(val);
            }
        })

        modifyPieces.forEach(val => {
            if (val.attributes == null) {
                val.attributes = {}
                val.attributes[attribute] = value == null ? true : value;
            } else {
                val.attributes[attribute] = value == null ? (attribute in (val.attributes ?? {}) ? !val.attributes[attribute] : true) : value;
            }
        })

        if (maxPiece == minPiece) {
            const beforePiece: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[minPiece].attributes
                },
                content: block.content[minPiece].content.substring(0, minPos)
            }
            const insertPiece: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[minPiece].attributes,
                    [attribute]: value == null ? (attribute in (block.content[minPiece].attributes ?? {}) ? !block.content[minPiece].attributes[attribute] : true) : value
                },
                content: block.content[minPiece].content.substring(minPos, maxPos)
            }
            const afterPiece: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[maxPiece].attributes
                },
                content: block.content[maxPiece].content.substring(maxPos)
            }
            this.SetState(s => {
                const oldNote = this.state.note;
                const newBlockPieces: PieceNode[] = [];
                newBlockPieces.push(...beforePieces);
                if (beforePiece.content.length > 0) {
                    newBlockPieces.push(beforePiece);
                }
                if (insertPiece.content.length > 0) {
                    newBlockPieces.push(insertPiece);
                }
                if (afterPiece.content.length > 0) {
                    newBlockPieces.push(afterPiece);
                }
                newBlockPieces.push(...afterPieces);
                oldNote.blocks[blockId].content = newBlockPieces;
                return {
                    ...s,
                    note: oldNote
                }
            });
        } else {
            const minBefore: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[minPiece].attributes
                },
                content: block.content[minPiece].content.substring(0, minPos)
            }
            const minAfter: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[minPiece].attributes,
                    [attribute]: value == null ? (attribute in (block.content[minPiece].attributes ?? {}) ? !block.content[minPiece].attributes[attribute] : true) : value
                },
                content: block.content[minPiece].content.substring(minPos)
            }
            const maxBefore: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[maxPiece].attributes,
                    [attribute]: value == null ? (attribute in (block.content[maxPiece].attributes ?? {}) ? !block.content[maxPiece].attributes[attribute] : true) : value
                },
                content: block.content[maxPiece].content.substring(0, maxPos)
            }
            const maxAfter: PieceNode = {
                id: create_UUID(),
                attributes: {
                    ...block.content[maxPiece].attributes
                },
                content: block.content[maxPiece].content.substring(maxPos)
            }

            console.log(maxBefore)

            this.SetState(s => {
                const oldNote = this.state.note;
                const newBlockPieces: PieceNode[] = [];
                newBlockPieces.push(...beforePieces);
                if (minBefore.content.length > 0) {
                    newBlockPieces.push(minBefore);
                }
                if (minAfter.content.length > 0) {
                    newBlockPieces.push(minAfter);
                }
                newBlockPieces.push(...modifyPieces);
                if (maxBefore.content.length > 0) {
                    newBlockPieces.push(maxBefore);
                }
                if (maxAfter.content.length > 0) {
                    newBlockPieces.push(maxAfter);
                }
                newBlockPieces.push(...afterPieces);
                oldNote.blocks[blockId].content = newBlockPieces;
                return {
                    ...s,
                    note: oldNote
                }
            })
        }
        this.saveNote();
    }
}


export const AppNoteStore = new NoteStore();