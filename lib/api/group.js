import request from '../request/request.node';
import getUrl from '../tools/getUrl';
import defaultSettings from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import { UploadClientError } from '../tools/errors';
import retryIfThrottled from '../tools/retryIfThrottled';
/**
 * Create files group.
 */
/* eslint @typescript-eslint/camelcase: [2, {allow: ["pub_key"]}] */
export default function group(uuids, { publicKey, baseURL = defaultSettings.baseURL, jsonpCallback, secureSignature, secureExpire, cancel, source, integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
    return retryIfThrottled(() => request({
        method: 'POST',
        headers: {
            'X-UC-User-Agent': getUserAgent({ publicKey, integration })
        },
        url: getUrl(baseURL, '/group/', {
            jsonerrors: 1,
            pub_key: publicKey,
            files: uuids,
            callback: jsonpCallback,
            signature: secureSignature,
            expire: secureExpire,
            source
        }),
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
