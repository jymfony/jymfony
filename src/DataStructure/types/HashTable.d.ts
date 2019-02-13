/**
 * An hash table (hash map) is a data structure that implements an associative array abstract
 * data type, a structure that can map keys to values.
 */
declare class HashTable<T = any> extends Object implements Iterable<T> {
    /**
     * Whether the collection is empty.
     */
    isEmpty(): boolean;

    /**
     * Clone the collection.
     */
    copy(): HashTable<T>;

    /**
     * Returns an array copy of the collection.
     */
    toArray(): T[];

    /**
     * Clears the table.
     */
    clear(): void;

    /**
     * @inheritdoc
     */
    readonly length: number;

    /**
     * Gets the first element of the collection.
     */
    readonly first: T|undefined;

    /**
     * Gets the last element of the collection.
     */
    readonly last: T|undefined;

    /**
     * Inserts the key-value pair into the symbol table, overwriting the old value
     * with the new value if the key is already in the symbol table.
     */
    put(key: string|number, value: T): void;

    /**
     * Pushes a new value into the collection.
     */
    push(value: T): void;

    /**
     * Pops out an entry from the end of the collection.
     */
    pop(): T;

    /**
     * Gets the value associated with key, if set.
     */
    get(key: string|number): T | undefined;

    /**
     * Returns if a key is present in the table.
     */
    has(key: string|number): boolean;

    /**
     * Removes an element from the collection.
     */
    remove(key: string|number): T | undefined;

    /**
     * Returns an array or a literal object with all the elements
     * of the collection.
     */
    toObject(): T[] | Record<string | number, T>;

    /**
     * Creates an HashTable from an object or array.
     */
    static fromObject<T = any>(obj: T[] | Record<string | number, T>): HashTable<T>

    /**
     * Returns all the table keys (ordered).
     */
    keys(): (string | number)[];

    /**
     * Gets an iterator for this hash table.
     */
    [Symbol.iterator](): Iterator<T>;
}
