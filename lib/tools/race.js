import CancelController from './CancelController';
const race = (fns, { cancel } = {}) => {
    let lastError = null;
    let winnerIndex = null;
    const controllers = fns.map(() => new CancelController());
    const createStopRaceCallback = (i) => () => {
        winnerIndex = i;
        controllers.forEach((controller, index) => index !== i && controller.cancel());
    };
    if (cancel) {
        cancel.onCancel(() => {
            controllers.forEach(controller => controller.cancel());
        });
    }
    return Promise.all(fns.map((fn, i) => {
        const stopRace = createStopRaceCallback(i);
        return Promise.resolve()
            .then(() => fn({ stopRace, cancel: controllers[i] }))
            .then(result => {
            stopRace();
            return result;
        })
            .catch(error => {
            lastError = error;
            return null;
        });
    })).then(results => {
        if (winnerIndex === null) {
            throw lastError;
        }
        else {
            return results[winnerIndex];
        }
    });
};
export { race };
