import {BlockNode} from "../Block";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {GetOrderedListCounter} from "../../../utils/orderedListCounter";

export const renderOlPrefix = (block: BlockNode, blockId: number, pieces: VDomNode[]) : VDomNode[] => {
    if (block.attributes != null &&
        "ol" in block.attributes &&
        block.attributes.ol == true) {
        const num = GetOrderedListCounter(blockId);
        pieces.push(<span key1={"num"}>{num.toString()}. </span>);
        return pieces;
    }
    return pieces;
}