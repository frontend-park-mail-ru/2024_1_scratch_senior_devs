import {AppDispatcher} from "../../../modules/dispatcher";
import {NoteStoreActions} from "../../../modules/store/NoteStore";

export const moveCursorUpAndDown = (blockId: number) => {
    setTimeout(()=> {
        AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
            blockId: blockId - 1,
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