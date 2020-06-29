import request from '../request/request.node';
import getUrl from '../tools/getUrl';
import defaultSettings from '../defaultSettings';
import { getUserAgent } from '../tools/userAgent';
import camelizeKeys from '../tools/camelizeKeys';
import { UploadClientError } from '../tools/errors';
import retryIfThrottled from '../tools/retryIfThrottled';
export var TypeEnum;
(function (TypeEnum) {
    TypeEnum["Token"] = "token";
    TypeEnum["FileInfo"] = "file_info";
})(TypeEnum || (TypeEnum = {}));
/**
 * TokenResponse Type Guard.
 */
export const isTokenResponse = (response) => {
    return response.type !== undefined && response.type === TypeEnum.Token;
};
/**
 * FileInfoResponse Type Guard.
 */
export const isFileInfoResponse = (response) => {
    return response.type !== undefined && response.type === TypeEnum.FileInfo;
};
/**
 * Uploading files from URL.
 */
/* eslint @typescript-eslint/camelcase: [2, {allow: ["pub_key", "source_url", "check_URL_duplicates", "save_URL_duplicates"]}] */
export default function fromUrl(sourceUrl, { publicKey, baseURL = defaultSettings.baseURL, store, fileName, checkForUrlDuplicates, saveUrlForRecurrentUploads, secureSignature, secureExpire, source = 'url', cancel, integration, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
    return retryIfThrottled(() => request({
        method: 'POST',
        headers: {
            'X-UC-User-Agent': getUserAgent({ publicKey, integration })
        },
        url: getUrl(baseURL, '/from_url/', {
            jsonerrors: 1,
            pub_key: publicKey,
            source_url: sourceUrl,
            store: typeof store === 'undefined' ? 'auto' : store ? 1 : undefined,
            filename: fileName,
            check_URL_duplicates: checkForUrlDuplicates ? 1 : undefined,
            save_URL_duplicates: saveUrlForRecurrentUploads ? 1 : undefined,
            signature: secureSignature,
            expire: secureExpire,
            source: source
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
