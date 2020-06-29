import { isFileData, isUrl, isUuid } from '../uploadFile/types';
/**
 * FileData type guard.
 */
export const isFileDataArray = (data) => {
    for (const item of data) {
        if (!isFileData(item)) {
            return false;
        }
    }
    return true;
};
/**
 * Uuid type guard.
 */
export const isUuidArray = (data) => {
    for (const item of data) {
        if (!isUuid(item)) {
            return false;
        }
    }
    return true;
};
/**
 * Url type guard.
 */
export const isUrlArray = (data) => {
    for (const item of data) {
        if (!isUrl(item)) {
            return false;
        }
    }
    return true;
};
