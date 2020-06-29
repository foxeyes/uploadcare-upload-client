class Events {
    constructor() {
        this.events = Object.create({});
    }
    emit(event, data) {
        this.events[event]?.forEach(fn => fn(data));
    }
    on(event, callback) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(callback);
    }
    off(event, callback) {
        if (callback) {
            this.events[event] = this.events[event].filter(fn => fn !== callback);
        }
        else {
            this.events[event] = [];
        }
    }
}
export { Events };
