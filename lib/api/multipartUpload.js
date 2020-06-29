import request from '../request/request.node';
import { getUserAgent } from '../tools/userAgent';
/**
 * Complete multipart uploading.
 */
export default function multipartUpload(part, url, { publicKey, cancel, onProgress, integration }) {
    return request({
        method: 'PUT',
        url,
        headers: {
            'X-UC-User-Agent': publicKey
                ? getUserAgent({ publicKey, integration })
                : undefined
        },
        data: part,
        onProgress,
        cancel
    })
        .then(result => {
        // hack for node ¯\_(ツ)_/¯
        if (onProgress)
            onProgress({ value: 1 });
        return result;
    })
        .then(({ status }) => ({ code: status }));
}
