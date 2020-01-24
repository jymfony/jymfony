declare class LinkedList<T = any> extends Object implements Iterable<T> {
    /**
     * Constructor.
     */
    constructor();

    /**
     * Empties the list.
     */
    clear(): void;

    /**
     * Pushes a value at the end of the list.
     */
    push(value: T): void;

    /**
     * Pops out a value from the end of the list.
     */
    pop(): T | undefined;

    /**
     * Pushes a value at the beginning of the list.
     */
    unshift(value: T): void;

    /**
     * Pops out a value from the beginning of the list.
     */
    shift(): T | undefined;

    /**
     * Gets the first element of the collection.
     */
    readonly first: T | undefined;

    /**
     * Gets the last element of the collection.
     */
    readonly last: T | undefined;

    /**
     * Returns how many elements are in the list.
     */
    readonly length: number;

    /**
     * @inheritdoc
     */
    copy(): LinkedList<T>;

    /**
     * @inheritdoc
     */
    toArray(): T[];

    /**
     * Iterate over all the collection elements.
     */
    [Symbol.iterator](): Iterator<T>;
}
