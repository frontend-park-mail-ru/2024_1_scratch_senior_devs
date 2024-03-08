/**
 *
 * @param str{string}
 * @param n{number}
 * @returns {string}
 */
export function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + "..." : str;
}

export function decode(raw) {
    const decoded = atob(raw.data);
    const bytes = Uint8Array.from(decoded, (m) => m.codePointAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}

export function mapNumberRange(n, a, b, c, d) {
    return ((n - a) * (d - c)) / (b - a) + c
}