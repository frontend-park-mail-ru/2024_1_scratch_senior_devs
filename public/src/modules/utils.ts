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
 * Декодирует строку из base64 в unicode
 * @param raw {string} закодированная строка
 * @returns {Object} декодированный объект
 */
export function decode(raw: string): object {
    const decoded = atob(raw);
    const bytes = Uint8Array.from(decoded, (m) => m.codePointAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
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