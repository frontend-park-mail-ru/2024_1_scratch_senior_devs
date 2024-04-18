import {VDomNode} from '@veglem/screact/dist/vdom';
import {BlockNode} from '../Block';

export const renderToDoPrefix = (block: BlockNode, pieces: VDomNode[]) : VDomNode[] => {
    if (block.attributes != null && 'todo' in block.attributes && block.attributes.todo == true) {
        pieces.push(<input type="checkbox" key1={'todo'} className="checked" onclick={(e) => {
            console.log(e.target.checked)

            if (e.target.classList.contains("checked")) {
                e.target.checked = false
                e.target.classList.remove("checked")
            } else {
                e.target.checked = true
                e.target.classList.add("checked")
            }
            console.log(e.target.checked)
        }} />);
        return pieces;
    }
    return pieces;
};