import { cancelError } from './errors';
const DEFAULT_INTERVAL = 500;
const poll = ({ check, interval = DEFAULT_INTERVAL, cancel }) => new Promise((resolve, reject) => {
    let timeoutId;
    if (cancel) {
        cancel.onCancel(() => {
            timeoutId && clearTimeout(timeoutId);
            reject(cancelError('Poll cancelled'));
        });
    }
    const tick = () => {
        try {
            Promise.resolve(check(cancel))
                .then(result => {
                if (result) {
                    resolve(result);
                }
                else {
                    timeoutId = setTimeout(tick, interval);
                }
            })
                .catch(error => reject(error));
        }
        catch (error) {
            reject(error);
        }
    };
    timeoutId = setTimeout(tick, 0);
});
export { poll };
