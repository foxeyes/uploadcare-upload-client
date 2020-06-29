import { UploadcareFile } from '../tools/UploadcareFile';
import info from '../api/info';
const uploadFromUploaded = (uuid, { publicKey, fileName, baseURL, cancel, onProgress, source, integration, retryThrottledRequestMaxTimes, baseCDN }) => {
    return info(uuid, {
        publicKey,
        baseURL,
        cancel,
        source,
        integration,
        retryThrottledRequestMaxTimes
    })
        .then(fileInfo => new UploadcareFile(fileInfo, { baseCDN, fileName }))
        .then(result => {
        // hack for node ¯\_(ツ)_/¯
        if (onProgress)
            onProgress({ value: 1 });
        return result;
    });
};
export default uploadFromUploaded;
