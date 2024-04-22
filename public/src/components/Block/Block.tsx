import {Component} from '@veglem/screact/dist/component';
import {Piece, PieceNode} from '../Piece/Piece';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {ScReact} from '@veglem/screact';
import {AppNoteStore, NoteStoreActions} from '../../modules/stores/NoteStore';
import {AppDispatcher} from '../../modules/dispatcher';
import {getPieceHash} from '../../utils/hash';
import './block.sass';
import {renderUlPrefix} from './utils/ul';
import {renderOlPrefix} from './utils/ol';
import {getCursorInBlock, setCursorInBlock} from '../../utils/cursorPos';
import {moveCursorUpAndDown} from './utils/cursorActions';
import {Attach} from '../Attach/Attach';
import {NotesActions} from '../../modules/stores/NotesStore';
import {renderToDoPrefix} from './utils/todo';

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
    isChosen: boolean,
    onChange: () => void
}

export class Block extends Component<BlockProps, BlockState> {
    state = {
        piecesCount: 0,
        dragBtnActive: false,
        dragged: false
    };

    renderPrevSymbol = (): VDomNode[] => {
        const pieces: Array<VDomNode> = [];
        const block = AppNoteStore.state.note.blocks[this.props.blockId];
        if (block.attributes != null && 'youtube' in block.attributes) {
            pieces.push(<iframe width="560" height="315" className="youtube-player" src={block.attributes.youtube} sandbox="allow-same-origin allow-scripts"></iframe>);
        }
        if (block.attributes != null && 'attach' in block.attributes) {
            const attachId = block.attributes['attach'];

            pieces.push(
                <Attach id={attachId} fileName={block.attributes['fileName']} handleRemove={() => {
                    const block = AppNoteStore.state.note.blocks[this.props.blockId];
                    block.type = 'div';
                    block.attributes = null;
                    block.content = [];
                    AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                        blockId: this.props.blockId,
                        newBlock: block
                    });
                    moveCursorUpAndDown(this.props.blockId);
                    return;
                }}/>
            );

            return pieces;
        }
        renderToDoPrefix(block, this.props.blockId, pieces);
        renderUlPrefix(block, pieces);
        renderOlPrefix(block, this.props.blockId, pieces);
        return pieces;
    };

    renderChildren = () => {
        if (AppNoteStore.state.note.blocks[this.props.blockId].content !== undefined) {
            const pieces = Array<VDomNode>();
            for (let i = 0; i < AppNoteStore.state.note.blocks[this.props.blockId].content.length; ++i) {
                pieces.push(
                    <Piece
                        blockId={this.props.blockId}
                        pieceId={i}
                        pieceHash={getPieceHash(AppNoteStore.state.note.blocks[this.props.blockId].content[i])}
                    ></Piece>
                );
            }
            return pieces;
        } else {
            const pieces = Array<VDomNode>();
            pieces.push(<span/>);
            return pieces as VDomNode[];
        }
    };

    private self: HTMLElement;

    private chosenClass: string = '';

    componentDidUpdate() {
        setCursorInBlock(this.self, this.props.blockId);
        if (AppNoteStore.state.cursorPosition != null &&
            this.props.blockId === AppNoteStore.state.cursorPosition.blockId) {
            this.self.focus();
        }
    }

    componentDidMount() {
        this.setState(s => {
            return {...s, piecesCount: AppNoteStore.state.note.blocks[this.props.blockId].content?.length};
        });

        if (AppNoteStore.state.note.blocks[this.props.blockId].type == 'img') {
            console.log(AppNoteStore.state.note.blocks[this.props.blockId].id);
            AppDispatcher.dispatch(NotesActions.FETCH_IMAGE, {
                blockId: this.props.blockId,
                imageId: AppNoteStore.state.note.blocks[this.props.blockId].attributes['id']
            });
        } else if (AppNoteStore.state.note.blocks[this.props.blockId].attributes && "youtube" in AppNoteStore.state.note.blocks[this.props.blockId].attributes) {
            this.self.classList.add("hidden")
        }
    }

    private contener: HTMLElement;

    render(): VDomNode {
        console.log(AppNoteStore.state.cursorPosition);
        return (
            <div
                className={'block' + (AppNoteStore.state.cursorPosition?.blockId == this.props.blockId.toString() ? ' block-chosen' : '')}
                style={'width: 100%;'}
                ref={(elem) => {
                    this.contener = elem;
                }}
                ondragend={() => {
                    this.contener.draggable = false;
                }}
                ondragstart={(e) => {
                    e.dataTransfer.setData('blockId', this.props.blockId.toString());
                }}
                onclick={() => {
                    if (AppNoteStore.state.note.blocks[this.props.blockId].type === 'img' ||
                        (AppNoteStore.state.note.blocks[this.props.blockId].attributes != null &&
                           'fileName' in AppNoteStore.state.note.blocks[this.props.blockId].attributes)) {
                        const cursorPosition = getCursorInBlock(this.self);
                        AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                            blockId: this.props.blockId,
                            pos: cursorPosition
                        });
                    }
                }}
            >

                <img
                    src="src/assets/drag-btn.svg"
                    alt=""
                    className={'drag-btn'}
                    key1={'move-btn'}
                    onmousedown={() => {
                        this.contener.draggable = true;
                    }}/>


                <div className="piece-container">
                    <span key1={'delim'}>
                        {this.renderPrevSymbol()}
                    </span>
                    {ScReact.createElement(AppNoteStore.state.note.blocks[this.props.blockId].type, {
                            key: 'peices',
                            ...AppNoteStore.state.note.blocks[this.props.blockId].attributes,
                            contentEditable: true,
                            ref: (elem: HTMLElement) => {
                                this.self = elem;
                            },
                            className: 'editablediv' ,
                            style: 'display: inline;',
                            oninput: (e: InputEvent) => {
                                e.preventDefault();
                                if ('inputType' in e) {
                                    if (AppNoteStore.state.note.blocks[this.props.blockId].type == 'div' &&
                                        (AppNoteStore.state.note.blocks[this.props.blockId].attributes == null ||
                                            !('ol' in AppNoteStore.state.note.blocks[this.props.blockId].attributes) &&
                                            !('ul' in AppNoteStore.state.note.blocks[this.props.blockId].attributes) &&
                                            !('todo' in AppNoteStore.state.note.blocks[this.props.blockId].attributes)) &&
                                        (e.target as HTMLElement).textContent == '/') {
                                        const elem = e.target as HTMLElement;
                                        AppDispatcher.dispatch(NoteStoreActions.OPEN_DROPDOWN, {
                                            blockPos: {
                                                bottom: elem.parentElement.parentElement.parentElement.parentElement.clientHeight - elem.parentElement.parentElement.offsetTop,
                                                top: elem.parentElement.parentElement.offsetTop + 40
                                            },
                                            blockId: this.props.blockId
                                        });
                                    }
                                    if (e.inputType == 'insertText') {
                                        const elem = e.target as HTMLElement;
                                        if (elem.childNodes.length === 1 && elem.childNodes[0].nodeName === '#text') {
                                            const text = elem.childNodes[0].textContent;
                                            this.self.childNodes[0].remove();
                                            AppDispatcher.dispatch(NoteStoreActions.ADD_NEW_PIECE, {
                                                blockId: this.props.blockId,
                                                insertPosition: 0,
                                                content: text
                                            });
                                            return;
                                        }
                                    }
                                    const elemPieces = Array<{ pieceId: string, content: string }>();

                                    const elem = e.target as HTMLElement;

                                    for (let i = 0; i < elem.children.length; ++i) {
                                        const r = /piece-(\d+)-(\d+)/;
                                        const matches = r.exec(elem.children[i].id.toString());

                                        if (matches != null) {
                                            elemPieces.push({
                                                pieceId: i.toString(),
                                                content: elem.children[i].textContent.replace('\n', '')
                                            });
                                        }
                                    }

                                    const cursorPosition = getCursorInBlock(this.self);

                                    AppDispatcher.dispatch(NoteStoreActions.CHANGE_PIECE, {
                                        blockId: this.props.blockId,
                                        pieces: elemPieces,
                                        posOffset: cursorPosition
                                    });

                                    if (elemPieces.length == 0) {
                                        moveCursorUpAndDown(this.props.blockId);
                                    }

                                    this.props.onChange();

                                    console.log(elemPieces, cursorPosition);
                                }
                            },
                            onkeydown: (e: Event) => {
                                if ('key' in e && e.key === 'Enter') {
                                    e.preventDefault();
                                    AppDispatcher.dispatch(NoteStoreActions.ADD_BLOCK, {insertPos: this.props.blockId + 1});
                                    const block = AppNoteStore.state.note.blocks[this.props.blockId];
                                    if (block.attributes != null &&
                                        (('ul' in block.attributes &&
                                            block.attributes.ul == true) ||
                                        ('ol' in block.attributes &&
                                            block.attributes.ol == true) ||
                                        ('todo' in block.attributes &&
                                            block.attributes.todo == true)) &&
                                        block.content.length === 0) {
                                        block.attributes = null;
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                            blockId: this.props.blockId,
                                            newBlock: block
                                        });
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    AppDispatcher.dispatch(NoteStoreActions.ADD_BLOCK, {insertPos: this.props.blockId + 1});
                                    if (block.attributes != null &&
                                        'ul' in block.attributes &&
                                        block.attributes.ul == true) {
                                        setTimeout(() => {
                                            const newBlock = AppNoteStore.state.note.blocks[this.props.blockId + 1];
                                            newBlock.attributes = {};
                                            newBlock.attributes['ul'] = true;
                                            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                blockId: this.props.blockId,
                                                pos: 0
                                            });
                                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                                blockId: this.props.blockId + 1,
                                                newBlock: newBlock
                                            });
                                            setTimeout(() => {
                                                AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                    blockId: this.props.blockId + 1,
                                                    pos: 0
                                                });
                                            });
                                        });
                                    }
                                    if (block.attributes != null &&
                                        'ol' in block.attributes &&
                                        block.attributes.ol == true) {
                                        setTimeout(() => {
                                            const newBlock = AppNoteStore.state.note.blocks[this.props.blockId + 1];
                                            newBlock.attributes = {};
                                            newBlock.attributes['ol'] = true;
                                            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                blockId: this.props.blockId,
                                                pos: 0
                                            });
                                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                                blockId: this.props.blockId + 1,
                                                newBlock: newBlock
                                            });
                                            setTimeout(() => {
                                                AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                    blockId: this.props.blockId + 1,
                                                    pos: 0
                                                });
                                            });
                                        });
                                    }
                                    if (block.attributes != null &&
                                        'todo' in block.attributes &&
                                        block.attributes.todo == true) {
                                        setTimeout(() => {
                                            const newBlock = AppNoteStore.state.note.blocks[this.props.blockId + 1];
                                            newBlock.attributes = {};
                                            newBlock.attributes['todo'] = true;
                                            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                blockId: this.props.blockId,
                                                pos: 0
                                            });
                                            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                                blockId: this.props.blockId + 1,
                                                newBlock: newBlock
                                            });
                                            setTimeout(() => {
                                                AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                                                    blockId: this.props.blockId + 1,
                                                    pos: 0
                                                });
                                            });
                                        });
                                    }
                                } else if ('key' in e && e.key === 'Backspace' &&
                                    (AppNoteStore.state.note.blocks[this.props.blockId].content == null ||
                                        AppNoteStore.state.note.blocks[this.props.blockId].content.length === 0)) {
                                    e.preventDefault();
                                    const block = AppNoteStore.state.note.blocks[this.props.blockId];
                                    if (block.type !== 'div') {
                                        block.type = 'div';
                                        block.attributes = null;
                                        block.content = [];
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                            blockId: this.props.blockId,
                                            newBlock: block
                                        });
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        'ul' in block.attributes &&
                                        block.attributes.ul == true) {
                                        delete block.attributes.ul;
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                            blockId: this.props.blockId,
                                            newBlock: block
                                        });
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        'ol' in block.attributes &&
                                        block.attributes.ol == true) {
                                        delete block.attributes.ol;
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                            blockId: this.props.blockId,
                                            newBlock: block
                                        });
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        'todo' in block.attributes &&
                                        block.attributes.todo == true) {
                                        delete block.attributes.todo;
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                            blockId: this.props.blockId,
                                            newBlock: block
                                        });
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    if (block.attributes != null &&
                                        'fileName' in block.attributes) {
                                        delete block.attributes.fileName;
                                        block.attributes = null;
                                        block.type = 'div';
                                        block.content = [];
                                        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                                            blockId: this.props.blockId,
                                            newBlock: block
                                        });
                                        moveCursorUpAndDown(this.props.blockId);
                                        return;
                                    }
                                    AppDispatcher.dispatch(NoteStoreActions.REMOVE_BLOCK, {delPos: this.props.blockId});
                                    return;
                                } else if ('key' in e && e.key === 'ArrowDown') {
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
                                    });
                                } else if ('key' in e && e.key === 'ArrowUp') {
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
                                    });
                                } else if (AppNoteStore.state.note.blocks[this.props.blockId].content == null) {
                                    e.preventDefault();
                                }


                            },
                            onpaste: (e) => {
                                e.preventDefault();
                                const selection = window.getSelection();
                                const range = selection.getRangeAt(0);
                                const clonedRange = range.cloneRange();
                                clonedRange.selectNodeContents(this.self);
                                clonedRange.setEnd(range.endContainer, range.endOffset);

                                const cursorPosition = clonedRange.toString().length;

                                const pieces: { content: string, pieceId: string }[] = [];

                                if (AppNoteStore.state.note.blocks[this.props.blockId].content.length === 0) {
                                    pieces.push({
                                        pieceId: '0',
                                        content: e.clipboardData.getData('text').replace('\n', '')
                                    });

                                    AppDispatcher.dispatch(NoteStoreActions.ADD_NEW_PIECE, {
                                        blockId: this.props.blockId,
                                        insertPosition: 0,
                                        content: e.clipboardData.getData('text').replace('\n', '')
                                    });
                                    return;
                                }

                                let offset = 0;
                                AppNoteStore.state.note.blocks[this.props.blockId].content.forEach((piece, i) => {
                                    if (piece.content.length + offset < cursorPosition) {
                                        offset += piece.content.length;
                                        pieces.push({
                                            pieceId: i.toString(),
                                            content: piece.content
                                        });
                                    } else if (cursorPosition - offset < piece.content.length) {
                                        pieces.push({
                                            pieceId: i.toString(),
                                            content: piece.content.substring(0, cursorPosition - offset) +
                                                e.clipboardData.getData('text') +
                                                piece.content.substring(cursorPosition - offset)
                                        });

                                        offset += piece.content.length;
                                    }
                                });

                                AppDispatcher.dispatch(NoteStoreActions.CHANGE_PIECE, {
                                    blockId: this.props.blockId,
                                    pieces: pieces,
                                    posOffset: cursorPosition + e.clipboardData.getData('text').length
                                });

                            }
                        },
                        ...this.renderChildren()
                    )}
                </div>

            </div>
        );
    }
}