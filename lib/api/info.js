import request from '../request/request.node';
import getUrl from '../tools/getUrl';
import defaultSettings from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import { UploadClientError } from '../tools/errors';
import retryIfThrottled from '../tools/retryIfThrottled';
/**
 * Returns a JSON dictionary holding file info.
 */
/* eslint @typescript-eslint/camelcase: [2, {allow: ["pub_key", "file_id"]}] */
export default function info(uuid, { publicKey, baseURL = defaultSettings.baseURL, cancel, source, integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
    return retryIfThrottled(() => request({
        method: 'GET',
        headers: {
            'X-UC-User-Agent': getUserAgent({ publicKey, integration })
        },
        url: getUrl(baseURL, '/info/', {
            jsonerrors: 1,
            pub_key: publicKey,
            file_id: uuid,
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
