import uploadBase from './uploadBase';
import uploadFromUrl from './uploadFromUrl';
import uploadFromUploaded from './uploadFromUploaded';
import defaultSettings from '../defaultSettings';
import { isFileData, isUrl, isUuid } from './types';
import { isMultipart, getFileSize } from '../tools/isMultipart';
import uploadMultipart from './uploadMultipart';
/**
 * Uploads file from provided data.
 * @param data
 * @param options
 * @param [options.publicKey]
 * @param [options.fileName]
 * @param [options.baseURL]
 * @param [options.secureSignature]
 * @param [options.secureExpire]
 * @param [options.store]
 * @param [options.cancel]
 * @param [options.onProgress]
 * @param [options.source]
 * @param [options.integration]
 * @param [options.retryThrottledRequestMaxTimes]
 */
export default function uploadFile(data, { publicKey, fileName, baseURL = defaultSettings.baseURL, secureSignature, secureExpire, store, cancel, onProgress, source, integration, retryThrottledRequestMaxTimes, contentType, multipartChunkSize = defaultSettings.multipartChunkSize, baseCDN = defaultSettings.baseCDN }) {
    if (isFileData(data)) {
        const fileSize = getFileSize(data);
        if (isMultipart(fileSize)) {
            return uploadMultipart(data, {
                publicKey,
                contentType,
                multipartChunkSize,
                fileName,
                baseURL,
                secureSignature,
                secureExpire,
                store,
                cancel,
                onProgress,
                source,
                integration,
                retryThrottledRequestMaxTimes,
                baseCDN
            });
        }
        return uploadBase(data, {
            publicKey,
            fileName,
            baseURL,
            secureSignature,
            secureExpire,
            store,
            cancel,
            onProgress,
            source,
            integration,
            retryThrottledRequestMaxTimes,
            baseCDN
        });
    }
    if (isUrl(data)) {
        return uploadFromUrl(data, {
            publicKey,
            fileName,
            baseURL,
            secureSignature,
            secureExpire,
            store,
            cancel,
            onProgress,
            source,
            integration,
            retryThrottledRequestMaxTimes,
            baseCDN
        });
    }
    if (isUuid(data)) {
        return uploadFromUploaded(data, {
            publicKey,
            fileName,
            baseURL,
            cancel,
            onProgress,
            source,
            integration,
            retryThrottledRequestMaxTimes,
            baseCDN
        });
    }
    throw new TypeError(`File uploading from "${data}" is not supported`);
}
