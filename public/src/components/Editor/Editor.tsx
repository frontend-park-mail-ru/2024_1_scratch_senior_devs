import {Component} from '@veglem/screact/dist/component';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {Block, BlockNode} from '../Block/Block';
import {AppNoteStore, NoteStoreActions, NoteStoreState} from '../../modules/stores/NoteStore';
import {getBlockHash} from '../../utils/hash';
import {AppDispatcher} from '../../modules/dispatcher';
import './Editor.sass';
import {Dropdown} from '../Dropdown/Dropdown';
import {Tippy} from '../Tippy/Tippy';
import {Modal} from '../Modal/Modal';
import YoutubeDialogForm from '../YoutubeDialog/YoutubeDialog';

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
        dropdownOpen: false,
        tippyOpen: false,
        youtubeDialogOpen: false,
        title: ''
    };

    componentDidUpdate() {
        if (this.state.blocks == 1 && AppNoteStore.state.note.blocks[0].content?.length == 0 && AppNoteStore.state.cursorPosition?.blockId !== 0 && AppNoteStore.state.cursorPosition?.pos !== 0) {
            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {blockId: 0, pos: 0});
        }
    }

    private timer: NodeJS.Timeout = setTimeout(() => {});

    private optionsSetter = (blockId: number, anchorId: number, focusId: number, anchorPos: number, focusPos: number) => {};

    componentDidMount() {
        AppNoteStore.SubscribeToStore(this.updateState);
        this.setState(s => {
            return {...s, blocks: AppNoteStore.state.note.blocks.length};
        });

        document.onselectionchange = (e) => {
            if (document.getSelection().isCollapsed === false) {
                const r = /piece-(\d+)-(\d+)/;
                const matchesAnchor = r.exec(document.getSelection().anchorNode.parentElement.id.toString());
                const matchesFocus = r.exec(document.getSelection().focusNode.parentElement.id.toString());
                const offsetAnchor = document.getSelection().anchorOffset;
                const offsetFocus = document.getSelection().focusOffset;
                if (matchesAnchor != null && matchesFocus != null) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        const piece = document.querySelector(`#piece-${matchesFocus[1]}-${matchesFocus[2]}`) as HTMLElement;
                        const piece2 = document.querySelector(`#piece-${matchesAnchor[1]}-${matchesAnchor[2]}`) as HTMLElement;

                        this.openTippy();
                        const tippy = document.querySelector('#tippy') as HTMLElement;
                        tippy.style.top = (piece.getBoundingClientRect().y - tippy.getBoundingClientRect().height - 2).toString() + 'px';
                        tippy.style.left = (Math.min(piece.getBoundingClientRect().x, piece2.getBoundingClientRect().x) - 30).toString() + 'px';

                        this.optionsSetter(
                            Number(matchesFocus[1]),
                            Number(matchesAnchor[2]),
                            Number(matchesFocus[2]),
                            offsetAnchor,
                            offsetFocus
                        );
                        console.log('MOOVE');

                        // AppDispatcher.dispatch(NoteStoreActions.CHANGE_PIECE_ATTRIBUTES,
                        //     {
                        //         blockId: Number(matchesFocus[1]),
                        //         anchorId: Number(matchesAnchor[2]),
                        //         focusId: Number(matchesFocus[2]),
                        //         anchorPos: Number(offsetAnchor),
                        //         focusPos: Number(offsetFocus),
                        //         attribute: "underline"
                        //     })
                    }, 300);
                }
            }
        };
    }

    updateState = (store:NoteStoreState) => {
        console.log("Editor.UpdateState")
        if (AppNoteStore.state.note.title.length > 0) {
            this.noteTitlePlaceholderRef.innerHTML = '';
        }

        console.log(store.note)
        this.noteTitleRef.innerHTML = store.note?.title

        this.setState(state => ({
            ...state,
            youtubeDialogOpen: store.youtubeDialogOpen,
            dropdownOpen: store.dropdownPos.isOpen,
            blocks: store.note.blocks.length
        }));
    };

    closeEditor = () => {
        console.log('closeEditor');
        AppDispatcher.dispatch(NoteStoreActions.CLOSE_DROPDOWN);
        this.noteTitlePlaceholderRef.innerHTML = ""

        this.setState(state => ({
            ...state,
            dropdownOpen: false
        }));
    };

    openYoutubeDialog = () => {
        AppDispatcher.dispatch(NoteStoreActions.OPEN_YOUTUBE_DIALOG);
    };

    closeYoutubeDialog = () => {
        AppDispatcher.dispatch(NoteStoreActions.CLOSE_YOUTUBE_DIALOG);
    };

    openTippy = () => {
        this.setState(state => ({
            ...state,
            tippyOpen: true
        }));
    };

    closeTippy = () => {
        this.setState(state => ({
            ...state,
            tippyOpen: false
        }));
    };

    private renderBlocks = () => {
        const result = Array<VDomNode>();
        for (let i = 0; i < this.state.blocks; ++i) {
            result.push(
                <div className={'drag-area'}
                     ondrop={(e) => {
                         console.log(e.dataTransfer.getData('blockId'), i);
                         e.target.classList.remove('active');
                         AppDispatcher.dispatch(NoteStoreActions.MOVE_BLOCK, {
                            blockId: Number(e.dataTransfer.getData('blockId')),
                            posToMove: i
                         });
                     }}
                     ondragover={(e)=>{
                         e.preventDefault();
                     }}
                     ondragenter={(e) => {e.target.classList.add('active');}}
                     ondragleave={(e)=>{e.target.classList.remove('active');}}
                ></div>
            );
            result.push(
                <Block
                    key1={AppNoteStore.state.note.blocks[i].id}
                    blockId={i}
                    blockHash={getBlockHash(AppNoteStore.state.note.blocks[i])}
                    isChosen={AppNoteStore.state.cursorPosition != null && AppNoteStore.state.cursorPosition.blockId == i}
                    onChange={this.props.onChangeContent}
                />
            );
        }
        result.push(
            <div className={'drag-area'}
                 ondrop={(e) => {
                     console.log(e.dataTransfer.getData('blockId'), this.state.blocks);
                     e.target.style.border = 'none';
                     AppDispatcher.dispatch(NoteStoreActions.MOVE_BLOCK, {
                         blockId: Number(e.dataTransfer.getData('blockId')),
                         posToMove: this.state.blocks
                     });
                 }}
                 ondragover={(e) => {
                     e.preventDefault();
                 }}
                 ondragenter={(e) => {e.target.style.border = '1px solid blue';}}
                 ondragleave={(e)=>{e.target.style.border = 'none';}}
            ></div>
        );
        return result;
    };

    onChangeTitle = (e) => {
        console.log('oninput');
        console.log(e.target.textContent.length);

        if (e.target.textContent.length == 0) {
            this.noteTitlePlaceholderRef.innerHTML = 'Введите название';
        } else {
            this.noteTitlePlaceholderRef.innerHTML = '';
        }

        this.props.onChangeTitle(e.target.textContent);

        AppDispatcher.dispatch(NoteStoreActions.CHANGE_TITLE, {
            title: e.target.textContent
        });
    }

    private noteTitlePlaceholderRef
    private noteTitleRef

    render(): VDomNode {
        console.log("render")
        console.log(AppNoteStore.state.note.title)

        console.log(`left: ${AppNoteStore.state.dropdownPos.left}; top: ${AppNoteStore.state.dropdownPos.top};`);
        return (
            <div className="note-editor">
                <div className="note-editor__body">
                    <span className="placeholder" ref={ref => this.noteTitlePlaceholderRef = ref}></span>
                    <div className="note-title" contentEditable={true} oninput={this.onChangeTitle} ref={ref => this.noteTitleRef = ref}>

                    </div>

                    {this.renderBlocks()}

                </div>
                <Modal open={this.state.youtubeDialogOpen} content={<YoutubeDialogForm/>}
                       handleClose={this.closeYoutubeDialog}/>
                <Dropdown blockId={AppNoteStore.state.dropdownPos.blockId}
                          style={`left: ${AppNoteStore.state.dropdownPos.left}px; top: ${AppNoteStore.state.dropdownPos.top}px;`}
                          onClose={this.closeEditor}
                          open={this.state.dropdownOpen}
                          openYoutubeDialog={this.openYoutubeDialog}
                />
                <Tippy open={this.state.tippyOpen}
                       onClose={this.closeTippy}
                       optionsSetter={(func) => {
                           this.optionsSetter = func;
                       }}
                />
            </div>
        );
    }
}