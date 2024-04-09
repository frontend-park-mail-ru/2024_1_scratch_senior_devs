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
        const piece = AppNoteStore.state.note.blocks[this.props.blockId].content[this.props.pieceId];
        if (piece.attributes != null) {
            piece.attributes.style = "";
            if ("bold" in piece.attributes && piece.attributes.bold === true) {
                piece.attributes.style += "font-style: bold; ";
            }
            if ("underline" in piece.attributes && piece.attributes.underline === true ||
                "lineThrough" in piece.attributes && piece.attributes.lineThrough === true) {
                piece.attributes.style += ("text-decoration: " +
                    (("underline" in piece.attributes && piece.attributes.underline === true) ? "underline " : "") +
                    (("lineThrough" in piece.attributes && piece.attributes.lineThrough === true) ? "line-through " : "")
                    + "; ");
            }
            if ("italic" in piece.attributes && piece.attributes.italic === true) {
                piece.attributes.style += "font-style: italic; "
            }
            if ("color" in piece.attributes) {
                piece.attributes.style += `color: ${piece.attributes.color}; `
            }
            if ("backgroundColor" in piece.attributes) {
                piece.attributes.style += `background-color: ${piece.attributes.backgroundColor}; `
            }
        }


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