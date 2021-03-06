/// <reference types="ws" />
/// <reference types="node" />
import WebSocket from '../tools/sockets.node';
import { FileInfo } from '../api/types';
import { Status } from '../api/fromUrlStatus';
import { Events } from './events';
declare type AllStatuses = StatusErrorResponse | StatusProgressResponse | StatusSuccessResponse;
declare type StatusProgressResponse = {
    status: Status.Progress;
    done: number;
    total: number;
};
declare type StatusErrorResponse = {
    status: Status.Error;
    msg: string;
    url: string;
};
declare type StatusSuccessResponse = {
    status: Status.Success;
} & FileInfo;
declare type Message = {
    event: string;
    data: {
        channel: string;
    };
};
declare type EventTypes = {
    [key: string]: AllStatuses;
} & {
    connected: undefined;
} & {
    error: Error;
};
declare class Pusher {
    key: string;
    disconnectTime: number;
    ws: WebSocket | undefined;
    queue: Message[];
    isConnected: boolean;
    subscribers: number;
    emmitter: Events<EventTypes>;
    disconnectTimeoutId: NodeJS.Timeout | null;
    constructor(pusherKey: string, disconnectTime?: number);
    connect(): void;
    disconnect(): void;
    send(event: string, data: any): void;
    subscribe(token: string, handler: (data: AllStatuses) => void): void;
    unsubscribe(token: string): void;
    onError(callback: (error: Error) => void): () => void;
}
declare const getPusher: (key: string) => Pusher;
declare const preconnect: (key: string) => void;
export default Pusher;
export { getPusher, preconnect };
