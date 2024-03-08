/**
 * Обрезает переданную строку, если она длиннее, чем n символов
 * @param str {string} исходная строка
 * @param n {number} максимальная длинна строки, которая не будет обрезана
 * @returns {string}
 */
export function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + "..." : str;
}

/**
 * Декодирует строку из base64 в utf-8
 * @param raw {string} закодированная строка
 * @returns {Object} декодированный объект
 */
export function decode(raw) {
    const decoded = atob(raw);
    const bytes = Uint8Array.from(decoded, (m) => m.codePointAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}

/**
 * Страшная математическая формула. Нужна для 3d tilt эффекта у карточек на главной странице
 * @param n
 * @param a
 * @param b
 * @param c
 * @param d
 * @returns {float}
 */
export function mapNumberRange(n, a, b, c, d) {
    return ((n - a) * (d - c)) / (b - a) + c
}