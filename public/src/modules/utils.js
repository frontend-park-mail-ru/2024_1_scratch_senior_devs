/**
 *
 * @param str{string}
 * @param n{number}
 * @returns {string}
 */
export function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + "..." : str;
}