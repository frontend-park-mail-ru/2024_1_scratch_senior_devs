import {AppNotesStore} from "./stores/NotesStore";
import {NoteType} from "../utils/types";

/**
 * Обрезает переданную строку, если она длиннее, чем n символов
 * @param str {string} исходная строка
 * @param n {number} максимальная длинна строки, которая не будет обрезана
 * @returns {string}
 */
export function truncate(str: string, n: number): string{
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}


/**
 * Возвращает true если заметка является подзаметкой
 */
export const isSubNote = (note:NoteType): boolean => {
    return note.parent != "00000000-0000-0000-0000-000000000000"
}

/**
 * Определеяет максимальную задержку в ожидании ответа от сервера
 * @param ms - время в милисекундах
 * @returns {AbortSignal}
 */
export function timeout(ms: number): AbortSignal {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), ms);
    return ctrl.signal;
}

/**
 * Генерирует случайную строку
 * @returns {string}
 */
export const createUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export function formatDate(date:string): string {
    return new Intl.DateTimeFormat('ru', {
        month: 'short', day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23'
    }).format(new Date(date)).replace(',', '');
}

/**
 * Скачивает файл
 */
export function downloadFile(url:string, fileName:string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


/**
 * Обрезает фото до разрешения 1:1
 */
export const crop = (url:string, aspectRatio=1):Promise<HTMLCanvasElement> => {
    return new Promise(resolve => {
        const inputImage = new Image();

        inputImage.onload = () => {
            const inputWidth = inputImage.naturalWidth;
            const inputHeight = inputImage.naturalHeight;

            const inputImageAspectRatio = inputWidth / inputHeight;

            let outputWidth = inputWidth;
            let outputHeight = inputHeight;
            if (inputImageAspectRatio > aspectRatio) {
                outputWidth = inputHeight * aspectRatio;
            } else if (inputImageAspectRatio < aspectRatio) {
                outputHeight = inputWidth / aspectRatio;
            }

            const outputX = (outputWidth - inputWidth) * 0.5;
            const outputY = (outputHeight - inputHeight) * 0.5;

            const outputImage = document.createElement('canvas');

            outputImage.width = outputWidth;
            outputImage.height = outputHeight;

            const ctx = outputImage.getContext('2d');
            ctx.drawImage(inputImage, outputX, outputY);
            resolve(outputImage);
        };

        inputImage.src = url;
    });
};


/**
 * Возвращает id видео по его ссылке
 * Возвращает null в случае, если ссылка некорректна
 */
export const parseYoutubeLink = (url:string) => {
    const check = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    const match = check.exec(url);
    if (match != null && match.length > 0) {
        return match[1];
    }

    return null;
};


/**
 * Скроллит вверх к началу страницы
 */
export const scrollToTop = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0
}

export const parseNoteTitle = (title:string) => {
    return title ? title : "Пустая заметка"
}

export const setCursorAtNodePosition = (node, index) => {
    let range = document.createRange();
    let selection = window.getSelection();
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
            for (let child of node.childNodes) {
                if (found) break;
                searchNode(child);
            }
        }
    }

    searchNode(node);
    selection.removeAllRanges();
    selection.addRange(range);
}

export const getCaretPosition = (editableDiv) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(editableDiv);
    clonedRange.setEnd(range.endContainer, range.endOffset);

    return clonedRange.toString().length;
}


export const unicodeToChar = (code) => {
    return String.fromCodePoint(parseInt(code, 16))
}
