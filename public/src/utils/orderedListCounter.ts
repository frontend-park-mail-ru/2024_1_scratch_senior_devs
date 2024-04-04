import {AppNoteStore} from "../modules/store/NoteStore";

export const GetOrderedListCounter = (currBlockId: number): number => {
    const blocks = AppNoteStore.state.note.blocks;
    let counter = 0;
    for (let i = currBlockId; i >= 0; --i) {
        const block = blocks[i]
        if (block.attributes != null &&
            "ol" in block.attributes &&
            block.attributes.ol == true) {
            ++counter;
        } else {
            return counter;
        }
    }

    return counter;
}