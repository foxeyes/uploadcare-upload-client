import defaultSettings from '../defaultSettings';
/**
 * Get file size.
 */
export const getFileSize = (file) => {
    return file.length || file.size;
};
/**
 * Check if FileData is multipart data.
 */
export const isMultipart = (fileSize, multipartMinFileSize = defaultSettings.multipartMinFileSize) => {
    return fileSize >= multipartMinFileSize;
};
