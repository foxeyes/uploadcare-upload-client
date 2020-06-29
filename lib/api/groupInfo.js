import request from '../request/request.node';
import getUrl from '../tools/getUrl';
import defaultSettings from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import { UploadClientError } from '../tools/errors';
import retryIfThrottled from '../tools/retryIfThrottled';
/**
 * Get info about group.
 */
/* eslint @typescript-eslint/camelcase: [2, {allow: ["pub_key", "group_id"]}] */
export default function groupInfo(id, { publicKey, baseURL = defaultSettings.baseURL, cancel, source, integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
    return retryIfThrottled(() => request({
        method: 'GET',
        headers: {
            'X-UC-User-Agent': getUserAgent({ publicKey, integration })
        },
        url: getUrl(baseURL, '/group/info/', {
            jsonerrors: 1,
            pub_key: publicKey,
            group_id: id,
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
