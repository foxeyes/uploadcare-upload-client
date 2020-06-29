import base from '../api/base';
import { UploadcareFile } from '../tools/UploadcareFile';
import { isReadyPoll } from '../tools/isReadyPoll';
const uploadFromObject = (file, { publicKey, fileName, baseURL, secureSignature, secureExpire, store, cancel, onProgress, source, integration, retryThrottledRequestMaxTimes, baseCDN }) => {
    return base(file, {
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
        retryThrottledRequestMaxTimes
    })
        .then(({ file }) => {
        return isReadyPoll({
            file,
            publicKey,
            baseURL,
            source,
            integration,
            retryThrottledRequestMaxTimes,
            onProgress,
            cancel
        });
    })
        .then(fileInfo => new UploadcareFile(fileInfo, { baseCDN }));
};
export default uploadFromObject;
