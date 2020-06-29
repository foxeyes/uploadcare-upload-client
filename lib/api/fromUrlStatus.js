import request from '../request/request.node';
import getUrl from '../tools/getUrl';
import defaultSettings from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import { UploadClientError } from '../tools/errors';
import retryIfThrottled from '../tools/retryIfThrottled';
export var Status;
(function (Status) {
    Status["Unknown"] = "unknown";
    Status["Waiting"] = "waiting";
    Status["Progress"] = "progress";
    Status["Error"] = "error";
    Status["Success"] = "success";
})(Status || (Status = {}));
const isErrorResponse = (response) => {
    return 'status' in response && response.status === Status.Error;
};
/**
 * Checking upload status and working with file tokens.
 */
export default function fromUrlStatus(token, { publicKey, baseURL = defaultSettings.baseURL, cancel, integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes } = {}) {
    return retryIfThrottled(() => request({
        method: 'GET',
        headers: publicKey
            ? { 'X-UC-User-Agent': getUserAgent({ publicKey, integration }) }
            : undefined,
        url: getUrl(baseURL, '/from_url/status/', {
            jsonerrors: 1,
            token
        }),
        cancel
    }).then(({ data, headers, request }) => {
        const response = camelizeKeys(JSON.parse(data));
        if ('error' in response && !isErrorResponse(response)) {
            throw new UploadClientError(`[${response.error.statusCode}] ${response.error.content}`, request, response.error, headers);
        }
        else {
            return response;
        }
    }), retryThrottledRequestMaxTimes);
}
