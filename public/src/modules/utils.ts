/**
 * Обрезает переданную строку, если она длиннее, чем n символов
 * @param str {string} исходная строка
 * @param n {number} максимальная длинна строки, которая не будет обрезана
 * @returns {string}
 */
export function truncate(str: string, n: number): string{
    return (str.length > n) ? str.slice(0, n-1) + "..." : str;
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
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export function formatDate(date:string): string {
    return new Intl.DateTimeFormat("ru", {
        month: "short", day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23"
    }).format(new Date(date)).replace(",", "")
}

export function debounce(func, ms) {
    let timeout: NodeJS.Timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this), ms);
    };
}