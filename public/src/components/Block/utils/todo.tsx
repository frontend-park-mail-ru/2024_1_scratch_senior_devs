import {VDomNode} from '@veglem/screact/dist/vdom';
import {BlockNode} from '../Block';
import {AppDispatcher} from '../../../modules/dispatcher';
import {NoteStoreActions} from '../../../modules/stores/NoteStore';

export const renderToDoPrefix = (block: BlockNode, blockId: number, pieces: VDomNode[]) : VDomNode[] => {
    if (block.attributes != null && 'todo' in block.attributes && block.attributes.todo == true) {
        console.log(block.attributes)
        pieces.push(<div className={"checkbox " + (block.attributes["checked"] ? "checked" : "")} onclick={(e) => {
            console.log("onclick")
            console.log(block.attributes["checked"])
            console.log(blockId)

            AppDispatcher.dispatch(NoteStoreActions.TOGGLE_CHECKBOX, blockId)

            // if (e.target.classList.contains("checked")) {
            //     e.target.checked = false
            //     e.target.classList.remove("checked")
            // } else {
            //     e.target.checked = true
            //     e.target.classList.add("checked")
            // }
            console.log(e.target.checked)
        }} />);
        return pieces;
    }
    return pieces;
};