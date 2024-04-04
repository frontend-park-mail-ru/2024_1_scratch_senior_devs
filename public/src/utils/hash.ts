import {BlockNode} from "../components/Block/Block";
import {PieceNode} from "../components/Piece/Piece";
import {AppNoteStore} from "../modules/stores/NoteStore";
import {GetOrderedListCounter} from "./orderedListCounter";

export const getStrHash = (str: string) => {
    let hash = 0, i: number, chr: number;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

export const getBlockHash = (block: BlockNode) => {
    let i = 0;
    if (block.attributes != null &&
        "ol" in block.attributes) {
        i = AppNoteStore.state.note.blocks.findIndex((b) => {
            return b.id == block.id;
        })
    }
    i = GetOrderedListCounter(i);
    return getStrHash(JSON.stringify(block)) | i;
}

export const getPieceHash = (piece: PieceNode) => {
    return getStrHash(JSON.stringify(piece));
}