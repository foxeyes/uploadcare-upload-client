declare type EmptyCallback = () => void;
declare type Callback<T> = (data: T) => void;
declare type ListenerStore<T extends {}> = {
    [U in keyof T]: ((data: T[U]) => void)[];
};
declare class Events<T extends {}> {
    events: ListenerStore<T>;
    emit<U extends keyof T>(event: U, data: T[U]): void;
    on<U extends keyof T>(event: U, callback: Callback<T[U]>): void;
    off<U extends keyof T>(event: U, callback?: Callback<T[U]> | EmptyCallback): void;
}
export { Events };
