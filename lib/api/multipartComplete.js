import request from '../request/request.node';
import getFormData from '../tools/buildFormData';
import getUrl from '../tools/getUrl';
import defaultSettings from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import retryIfThrottled from '../tools/retryIfThrottled';
import { UploadClientError } from '../tools/errors';
/**
 * Complete multipart uploading.
 */
export default function multipartComplete(uuid, { publicKey, baseURL = defaultSettings.baseURL, source = 'local', cancel, integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
    return retryIfThrottled(() => request({
        method: 'POST',
        url: getUrl(baseURL, '/multipart/complete/', { jsonerrors: 1 }),
        headers: {
            'X-UC-User-Agent': getUserAgent({ publicKey, integration })
        },
        data: getFormData([
            ['uuid', uuid],
            ['UPLOADCARE_PUB_KEY', publicKey],
            ['source', source]
        ]),
        cancel
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
