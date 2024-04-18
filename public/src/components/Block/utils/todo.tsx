import {VDomNode} from '@veglem/screact/dist/vdom';
import {BlockNode} from '../Block';
import {AppDispatcher} from '../../../modules/dispatcher';
import {NoteStoreActions} from '../../../modules/stores/NoteStore';

export const renderToDoPrefix = (block: BlockNode, blockId: number, pieces: VDomNode[]) : VDomNode[] => {
    if (block.attributes != null && 'todo' in block.attributes && block.attributes.todo == true) {
        pieces.push(
            <div className={"checkbox " + (block.attributes["checked"] ? "checked" : "")} onclick={() => {
                AppDispatcher.dispatch(NoteStoreActions.TOGGLE_CHECKBOX, blockId)
            }} />
        );

        return pieces;
    }

    return pieces;
};