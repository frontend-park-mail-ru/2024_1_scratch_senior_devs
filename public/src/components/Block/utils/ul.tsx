import {VDomNode} from "@veglem/screact/dist/vdom";
import {BlockNode} from "../Block";

export const renderUlPrefix = (block: BlockNode, pieces: VDomNode[]) : VDomNode[] => {
    if (block.attributes != null &&
        "ul" in block.attributes &&
        block.attributes.ul == true) {
        pieces.push(<span>• </span>);
        return pieces;
    }
    return pieces;
}