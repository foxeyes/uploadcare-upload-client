/**
 * FileData type guard.
 */
export const isFileData = (data) => {
    return (data !== undefined &&
        ((typeof Blob !== 'undefined' && data instanceof Blob) ||
            (typeof File !== 'undefined' && data instanceof File) ||
            (typeof Buffer !== 'undefined' && data instanceof Buffer)));
};
/**
 * Uuid type guard.
 */
export const isUuid = (data) => {
    const UUID_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
    const regExp = new RegExp(UUID_REGEX);
    return !isFileData(data) && regExp.test(data);
};
/**
 * Url type guard.
 *
 * @param {NodeFile | BrowserFile | Url | Uuid} data
 */
export const isUrl = (data) => {
    const URL_REGEX = '^(?:\\w+:)?\\/\\/([^\\s\\.]+\\.\\S{2}|localhost[\\:?\\d]*)\\S*$';
    const regExp = new RegExp(URL_REGEX);
    return !isFileData(data) && regExp.test(data);
};
