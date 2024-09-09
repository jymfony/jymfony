const GenericCollectionTrait = require('./Traits/GenericCollectionTrait');

class Node {
    constructor(data, prev, next) {
        this._data = data;
        this.prev = prev;
        this.next = next;
    }

    get data() {
        return this._data;
    }
}

class LinkedList extends mix(Object, GenericCollectionTrait) {
    /**
     * Constructor.
     */
    constructor() {
        super();

        this.clear();
    }

    /**
     * Empties the list.
     */
    clear() {
        /**
         * @type {Node}
         *
         * @private
         */
        this._head = null;

        /**
         * @type {Node}
         *
         * @private
         */
        this._tail = null;

        /**
         * @type {int}
         *
         * @private
         */
        this._count = 0;
    }

    /**
     * Pushes a value at the end of the list.
     *
     * @param {*} value
     */
    push(value) {
        const node = new Node(value, this._tail, null);

        if (null === this._head) {
            this._head = this._tail = node;
        } else {
            this._tail.next = node;
            this._tail = node;
        }

        ++this._count;
    }

    /**
     * Pops out a value from the end of the list.
     *
     * @returns {*}
     */
    pop() {
        if (null === this._tail) {
            return undefined;
        }

        const node = this._tail;
        this._tail = node.prev;
        --this._count;

        return node.data;
    }

    /**
     * Pushes a value at the beginning of the list.
     *
     * @param {*} value
     */
    unshift(value) {
        const node = new Node(value, null, this._head);

        if (null === this._tail) {
            this._head = this._tail = node;
        } else {
            this._head.prev = node;
            this._head = node;
        }

        ++this._count;
    }

    /**
     * Pops out a value from the beginning of the list.
     *
     * @returns {*}
     */
    shift() {
        if (null === this._head) {
            return undefined;
        }

        const node = this._head;
        this._head = node.next;
        --this._count;

        return node.data;
    }

    /**
     * Gets the first element of the collection.
     *
     * @returns {*}
     */
    get first() {
        return this._head ? this._head.data : undefined;
    }

    /**
     * Gets the last element of the collection.
     *
     * @returns {*}
     */
    get last() {
        return this._tail ? this._tail.data : undefined;
    }

    /**
     * Returns how many elements are in the list.
     *
     * @returns {int}
     */
    get length() {
        return this._count;
    }

    /**
     * @inheritdoc
     */
    copy() {
        const copy = new LinkedList();
        for (const n of this) {
            copy.push(n);
        }

        return copy;
    }

    /**
     * @inheritdoc
     */
    toArray() {
        return Array.from(this);
    }

    /**
     * Iterate over all the collection elements.
     */
    * [Symbol.iterator]() {
        if (null === this._head) {
            return;
        }

        let e = this._head;

        do {
            yield e.data;
        } while ((e = e.next));
    }
}

globalThis.LinkedList = LinkedList;
