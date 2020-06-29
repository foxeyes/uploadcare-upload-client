import info from '../api/info';
import { poll } from './poll';
function isReadyPoll({ file, publicKey, baseURL, source, integration, retryThrottledRequestMaxTimes, cancel, onProgress }) {
    return poll({
        check: cancel => info(file, {
            publicKey,
            baseURL,
            cancel,
            source,
            integration,
            retryThrottledRequestMaxTimes
        }).then(response => {
            if (response.isReady) {
                return response;
            }
            onProgress && onProgress({ value: 1 });
            return false;
        }),
        cancel
    });
}
export { isReadyPoll };
