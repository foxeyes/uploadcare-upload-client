import { delay } from './delay';
const defaultOptions = {
    factor: 2,
    time: 100
};
function retrier(fn, options = defaultOptions) {
    let attempts = 0;
    function runAttempt(fn) {
        const defaultDelayTime = Math.round(options.time * options.factor ** attempts);
        const retry = (ms) => delay(ms ?? defaultDelayTime).then(() => {
            attempts += 1;
            return runAttempt(fn);
        });
        return fn({
            attempt: attempts,
            retry
        });
    }
    return runAttempt(fn);
}
export default retrier;
