import {AppDispatcher} from "../../../modules/dispatcher";
import {NoteStoreActions} from "../../../modules/stores/NoteStore";

export const moveCursorUpAndDown = (blockId: number) => {
    setTimeout(()=> {
        AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
            blockId: blockId !== 0 ? blockId - 1 : 1,
            pos: 0
        })
        setTimeout(() => {
            AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
                blockId: blockId,
                pos: 0
            })
        })
    })
}