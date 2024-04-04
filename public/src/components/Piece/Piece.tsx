import {Component} from "@veglem/screact/dist/component";
import {VDOMAttributes, VDomNode} from "@veglem/screact/dist/vdom";
import {ScReact} from "@veglem/screact";
import {AppNoteStore} from "../../modules/stores/NoteStore";

export interface PieceNode {
    id: string,
    content: string,
    attributes?: VDOMAttributes
}

export type PieceProps = {
    ref: (elem: HTMLElement) => void,
    blockId: number,
    pieceId: number,
    pieceHash: number
}

export type PieceState = {
    // piece: PieceNode
}

export class Piece extends Component<PieceProps, PieceState> {
    render(): VDomNode {
        return (
            ScReact.createElement("span",
                {
                    ...AppNoteStore.state.note.blocks[this.props.blockId].content[this.props.pieceId].attributes,
                    key: AppNoteStore.state.note.blocks[this.props.blockId].content[this.props.pieceId].id,
                    id: "piece-" + this.props.blockId.toString() + "-" + this.props.pieceId.toString()
                },
                ScReact.createText(AppNoteStore.state.note.blocks[this.props.blockId].content[this.props.pieceId].content)
            )
        )
    }
}