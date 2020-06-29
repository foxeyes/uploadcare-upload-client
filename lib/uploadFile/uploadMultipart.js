import defaultSettings from '../defaultSettings';
import multipartStart from '../api/multipartStart';
import multipartUpload from '../api/multipartUpload';
import multipartComplete from '../api/multipartComplete';
import runWithConcurrency from '../tools/runWithConcurrency';
import { UploadcareFile } from '../tools/UploadcareFile';
import { getFileSize } from '../tools/isMultipart';
import { isReadyPoll } from '../tools/isReadyPoll';
import retrier from '../tools/retry';
const getChunk = (file, index, fileSize, chunkSize) => {
    const start = chunkSize * index;
    const end = Math.min(start + chunkSize, fileSize);
    return file.slice(start, end);
};
const uploadPartWithRetry = (chunk, url, { publicKey, onProgress, cancel, integration, multipartMaxAttempts }) => retrier(({ attempt, retry }) => multipartUpload(chunk, url, {
    publicKey,
    onProgress,
    cancel,
    integration
}).catch(error => {
    if (attempt < multipartMaxAttempts) {
        return retry();
    }
    throw error;
}));
const uploadMultipart = (file, { publicKey, fileName, fileSize, baseURL, secureSignature, secureExpire, store, cancel, onProgress, source, integration, retryThrottledRequestMaxTimes, contentType, multipartChunkSize = defaultSettings.multipartChunkSize, maxConcurrentRequests = defaultSettings.maxConcurrentRequests, multipartMaxAttempts = defaultSettings.multipartMaxAttempts, baseCDN }) => {
    const size = fileSize || getFileSize(file);
    let progressValues;
    const createProgressHandler = (size, index) => {
        if (!onProgress)
            return;
        if (!progressValues) {
            progressValues = Array(size).fill(0);
        }
        const sum = (values) => values.reduce((sum, next) => sum + next, 0);
        return ({ value }) => {
            progressValues[index] = value;
            onProgress({ value: sum(progressValues) / size });
        };
    };
    return multipartStart(size, {
        publicKey,
        contentType,
        fileName: fileName ?? file.name,
        baseURL,
        secureSignature,
        secureExpire,
        store,
        cancel,
        source,
        integration,
        retryThrottledRequestMaxTimes
    })
        .then(({ uuid, parts }) => Promise.all([
        uuid,
        runWithConcurrency(maxConcurrentRequests, parts.map((url, index) => () => uploadPartWithRetry(getChunk(file, index, size, multipartChunkSize), url, {
            publicKey,
            onProgress: createProgressHandler(parts.length, index),
            cancel,
            integration,
            multipartMaxAttempts
        })))
    ]))
        .then(([uuid]) => multipartComplete(uuid, {
        publicKey,
        baseURL,
        source,
        integration,
        retryThrottledRequestMaxTimes
    }))
        .then(fileInfo => {
        if (fileInfo.isReady) {
            return fileInfo;
        }
        else {
            return isReadyPoll({
                file: fileInfo.uuid,
                publicKey,
                baseURL,
                source,
                integration,
                retryThrottledRequestMaxTimes,
                onProgress,
                cancel
            });
        }
    })
        .then(fileInfo => new UploadcareFile(fileInfo, { baseCDN }));
};
export default uploadMultipart;
