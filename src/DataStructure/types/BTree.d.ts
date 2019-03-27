/**
 * Self-balancing tree data structure that maintains sorted data and allows searches,
 * sequential access, insertions, and deletions in logarithmic time.
 */
declare class BTree<K = any, V = any> extends Object implements Iterable<[K, V]> {
    public static readonly COMPARISON_EQUAL = 0;
    public static readonly COMPARISON_LESSER = -1;
    public static readonly COMPARISON_GREATER = 1;

    /**
     * Comparison function can be defined passing it to cmp_function parameter.
     * The function should return 0 if elements are equals, 1 if the first argument
     * is greater of the second, -1 if is lesser.
     */
    constructor(cmp_function?: Invokable<number>);

    /**
     * Whether the collection is empty.
     */
    isEmpty(): boolean;

    /**
     * Clone the collection.
     */
    copy(): BTree<K, V>;

    /**
     * Returns an array copy of the collection.
     */
    toArray(): [K, V][];

    /**
     * Clears the tree.
     */
    clear(): void;

    /**
     * The number of elements into the tree.
     */
    readonly length: number;

    /**
     * Returns the height of this BTree (for debugging).
     */
    readonly height: number;

    /**
     * Search an entry.
     * Returns a key-value pair with the exact key if found or:
     *  * if comparison is set to COMPARISON_LESSER, the nearest lesser key.
     *  * if comparison is set to COMPARISON_GREATER, the nearest greater key.
     *  * undefined otherwise
     */
    search(key: K, comparison?: number): [K, V];

    /**
     * Gets a value.
     */
    get(key: K): V|undefined;

    /**
     * Inserts the key-value pair into the symbol table, overwriting the old value
     * with the new value if the key is already in the symbol table.
     */
    push(key: K, val: V): void;

    /**
     * Removes an element from the collection.
     */
    remove(key: K): void;

    /**
     * Gets an iterator for this tree.
     */
    [Symbol.iterator](): Iterator<[K, V]>;
}
