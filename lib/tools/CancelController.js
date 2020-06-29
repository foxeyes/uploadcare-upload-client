class CancelController {
    constructor() {
        this.resolve = () => void 0;
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }
    cancel() {
        this.resolve();
    }
    onCancel(fn) {
        this.promise.then(fn);
    }
}
export default CancelController;
