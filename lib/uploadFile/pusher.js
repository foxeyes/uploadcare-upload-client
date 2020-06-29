import WebSocket from '../tools/sockets.node';
import { Status } from '../api/fromUrlStatus';
import { Events } from './events';
const response = (type, data) => {
    if (type === 'success') {
        return { status: Status.Success, ...data };
    }
    if (type === 'progress') {
        return { status: Status.Progress, ...data };
    }
    return { status: Status.Error, ...data };
};
class Pusher {
    constructor(pusherKey, disconnectTime = 30000) {
        this.ws = undefined;
        this.queue = [];
        this.isConnected = false;
        this.subscribers = 0;
        this.emmitter = new Events();
        this.disconnectTimeoutId = null;
        this.key = pusherKey;
        this.disconnectTime = disconnectTime;
    }
    connect() {
        this.disconnectTimeoutId && clearTimeout(this.disconnectTimeoutId);
        if (!this.isConnected && !this.ws) {
            const pusherUrl = `wss://ws.pusherapp.com/app/${this.key}?protocol=5&client=js&version=1.12.2`;
            this.ws = new WebSocket(pusherUrl);
            this.ws.addEventListener('error', error => {
                this.emmitter.emit('error', new Error(error.message));
            });
            this.emmitter.on('connected', () => {
                this.isConnected = true;
                this.queue.forEach(message => this.send(message.event, message.data));
                this.queue = [];
            });
            this.ws.addEventListener('message', e => {
                const data = JSON.parse(e.data);
                switch (data.event) {
                    case 'pusher:connection_established': {
                        this.emmitter.emit('connected', undefined);
                        break;
                    }
                    case 'pusher:ping': {
                        this.send('pusher:pong', {});
                        break;
                    }
                    case 'progress':
                    case 'success':
                    case 'fail': {
                        this.emmitter.emit(data.channel, response(data.event, JSON.parse(data.data)));
                    }
                }
            });
        }
    }
    disconnect() {
        const actualDisconect = () => {
            this.ws?.close();
            this.ws = undefined;
            this.isConnected = false;
        };
        if (this.disconnectTime) {
            this.disconnectTimeoutId = setTimeout(() => {
                actualDisconect();
            }, this.disconnectTime);
        }
        else {
            actualDisconect();
        }
    }
    send(event, data) {
        const str = JSON.stringify({ event, data });
        this.ws?.send(str);
    }
    subscribe(token, handler) {
        this.subscribers += 1;
        this.connect();
        const channel = `task-status-${token}`;
        const message = {
            event: 'pusher:subscribe',
            data: { channel }
        };
        this.emmitter.on(channel, handler);
        if (this.isConnected) {
            this.send(message.event, message.data);
        }
        else {
            this.queue.push(message);
        }
    }
    unsubscribe(token) {
        this.subscribers -= 1;
        const channel = `task-status-${token}`;
        const message = {
            event: 'pusher:unsubscribe',
            data: { channel }
        };
        this.emmitter.off(channel);
        if (this.isConnected) {
            this.send(message.event, message.data);
        }
        else {
            this.queue = this.queue.filter(msg => msg.data.channel !== channel);
        }
        if (this.subscribers === 0) {
            this.disconnect();
        }
    }
    onError(callback) {
        this.emmitter.on('error', callback);
        return () => this.emmitter.off('error', callback);
    }
}
let pusher = null;
const getPusher = (key) => {
    if (!pusher) {
        // no timeout for nodeJS and 30000 ms for browser
        const disconectTimeout = typeof window === 'undefined' ? 0 : 30000;
        pusher = new Pusher(key, disconectTimeout);
    }
    return pusher;
};
const preconnect = (key) => {
    getPusher(key).connect();
};
export default Pusher;
export { getPusher, preconnect };
