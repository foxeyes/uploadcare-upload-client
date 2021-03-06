const SEPARATOR = /\W|_/g;
/**
 * Transforms a string to camelCased.
 */
export function camelize(text) {
    return text
        .split(SEPARATOR)
        .map((word, index) => word.charAt(0)[index > 0 ? 'toUpperCase' : 'toLowerCase']() +
        word.slice(1))
        .join('');
}
/**
 * Transforms keys of an object to camelCased recursively.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function camelizeKeys(source) {
    if (!source || typeof source !== 'object') {
        return source;
    }
    return Object.keys(source).reduce((accumulator, key) => {
        accumulator[camelize(key)] =
            typeof source[key] === 'object' ? camelizeKeys(source[key]) : source[key];
        return accumulator;
    }, {});
}
