import {AppNoteStore} from '../modules/stores/NoteStore';

export const setCursorAtNodePosition = (node, index) => {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentPos = 0;
    let found = false;

    function searchNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (currentPos + node.length >= index) {
                range.setStart(node, index - currentPos);
                range.collapse(true);
                found = true;
            } else {
                currentPos += node.length;
            }
        } else {
            for (const child of node.childNodes) {
                if (found) break;
                searchNode(child);
            }
        }
    }

    searchNode(node);
    selection.removeAllRanges();
    selection.addRange(range);
};

export const setCursorInBlock = (elem: HTMLElement, blockId: number) => {
    if (AppNoteStore.state.cursorPosition != null &&
        blockId === AppNoteStore.state.cursorPosition.blockId) {
        try {
            if (AppNoteStore.state.note.blocks[blockId].content == undefined) {
                elem.focus();
                return;
            }
            setCursorAtNodePosition(elem, AppNoteStore.state.cursorPosition.pos);
            if (AppNoteStore.state.cursorPosition.pos === 0) {
                elem.click();
            }
        } catch (e) {
            
        }
    }
};

export const getCursorInBlock = (elem: HTMLElement): number => {
    try {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const clonedRange = range.cloneRange();
        clonedRange.selectNodeContents(elem);
        clonedRange.setEnd(range.endContainer, range.endOffset);

        return  clonedRange.toString().length;
    } catch {
        return 0
    }
};