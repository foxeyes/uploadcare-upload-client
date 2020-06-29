import request from '../request/request.node';
import getFormData from '../tools/buildFormData';
import getUrl from '../tools/getUrl';
import { defaultSettings, defaultFilename } from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import { UploadClientError } from '../tools/errors';
import retryIfThrottled from '../tools/retryIfThrottled';
/**
 * Performs file uploading request to Uploadcare Upload API.
 * Can be canceled and has progress.
 */
export default function base(file, { publicKey, fileName, baseURL = defaultSettings.baseURL, secureSignature, secureExpire, store, cancel, onProgress, source = 'local', integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
    return retryIfThrottled(() => request({
        method: 'POST',
        url: getUrl(baseURL, '/base/', {
            jsonerrors: 1
        }),
        headers: {
            'X-UC-User-Agent': getUserAgent({ publicKey, integration })
        },
        data: getFormData([
            ['file', file, fileName ?? file.name ?? defaultFilename],
            ['UPLOADCARE_PUB_KEY', publicKey],
            [
                'UPLOADCARE_STORE',
                typeof store === 'undefined' ? 'auto' : store ? 1 : 0
            ],
            ['signature', secureSignature],
            ['expire', secureExpire],
            ['source', source]
        ]),
        cancel,
        onProgress
    }).then(({ data, headers, request }) => {
        const response = camelizeKeys(JSON.parse(data));
        if ('error' in response) {
            throw new UploadClientError(`[${response.error.statusCode}] ${response.error.content}`, request, response.error, headers);
        }
        else {
            return response;
        }
    }), retryThrottledRequestMaxTimes);
}
