export interface Job<T> {
    queue: string;
    payload: T;
}