/**
 * Priority queues are similar to queues, but values are inserted with
 * an assigned priority and popped out from the highest priority to the
 * lowest. The iterator is destructive: elements are popped out and
 * removed from the queue
 */
declare class PriorityQueue<T = any> extends Object implements Iterable<T> {
    /**
     * Whether the collection is empty.
     */
    isEmpty(): boolean;

    /**
     * Clone the collection.
     */
    copy(): PriorityQueue<T>;

    /**
     * Returns an array copy of the collection.
     */
    toArray(): T[];

    /**
     * Empties the queue.
     */
    clear(): void;

    /**
     * Returns how many elements are in the queue.
     */
    readonly length: number;

    /**
     * Gets the first element without modifying the queue.
     */
    peek(): T;

    /**
     * Pop the higher priority value from the queue.
     */
    pop(): T;

    /**
     * Push a value into the queue.
     */
    push(value: T, priority: number): void

    /**
     * Gets an iterator for this queue.
     */
    [Symbol.iterator](): Iterator<T>;
}
