const GenericCollectionTrait = require('./Traits/GenericCollectionTrait');

const left = index => (index * 2) + 1;
const right = index => (index * 2) + 2;
const parent = index => Math.floor((index - 1) / 2);

class PriorityNode {
    /**
     * Constructor.
     *
     * @param {*} value
     * @param {int} priority
     * @param {int} stamp
     */
    constructor(value, priority, stamp) {
        this.value = value;
        this.priority = priority;
        this.stamp = stamp;
    }
}

/**
 * Priority queues are similar to queues, but values are inserted with
 * an assigned priority and popped out from the highest priority to the
 * lowest. The iterator is destructive: elements are popped out and
 * removed from the queue
 */
class PriorityQueue extends mix(undefined, GenericCollectionTrait) {
    /**
     * Constructor.
     */
    __construct() {
        this.clear();
    }

    /**
     * Empties the queue.
     */
    clear() {
        /**
         * @type {Array}
         *
         * @private
         */
        this._heap = [];

        /**
         * @type {int}
         *
         * @private
         */
        this._stamp = 0;
    }

    /**
     * Make a copy queue.
     *
     * @returns {PriorityQueue}
     */
    copy() {
        const copy = new PriorityQueue();

        copy._heap = [ ...this._heap ];
        copy._stamp = this._stamp;

        return copy;
    }

    /**
     * Returns how many elements are in the queue.
     *
     * @returns {int}
     */
    get length() {
        return this._heap.length;
    }

    /**
     * Gets the first element without modifying the queue.
     *
     * @returns {*}
     */
    peek() {
        if (this.isEmpty()) {
            throw new UnderflowException();
        }

        return this._heap[0].value;
    }

    /**
     * Pop the higher priority value from the queue.
     *
     * @returns {*}
     */
    pop() {
        if (this.isEmpty()) {
            throw new UnderflowException();
        }

        const leaf = this._heap.pop();

        if (! this._heap.length) {
            return leaf.value;
        }

        const value = this._getRoot().value;
        this._setRoot(leaf);

        return value;
    }

    /**
     * Push a value into the queue.
     *
     * @param {*} value
     * @param {int} priority
     */
    push(value, priority) {
        this._heap.push(new PriorityNode(value, priority, this._stamp++));
        this._siftUp(this._heap.length - 1);
    }

    /**
     * Gets an element array copy (ordered)
     *
     * @returns {Array}
     */
    toArray() {
        const heap = [ ...this._heap ];
        const acc = [];

        while (! this.isEmpty()) {
            acc.push(this.pop());
        }

        this._heap = heap;
        return acc;
    }

    * [Symbol.iterator]() {
        while (! this.isEmpty()) {
            yield this.pop();
        }
    }

    /**
     * @param {*} a
     * @param {*} b
     *
     * @returns {int}
     *
     * @private
     */
    _compare(a, b) {
        const x = this._heap[a];
        const y = this._heap[b];

        return Math.sign(x.priority - y.priority) || Math.sign(y.stamp - x.stamp);
    }

    /**
     * @param {*} a
     * @param {*} b
     *
     * @private
     */
    _swap(a, b) {
        const tmp = this._heap[a];
        this._heap[a] = this._heap[b];
        this._heap[b] = tmp;
    }

    /**
     * @param {int} parent
     *
     * @returns {*}
     *
     * @private
     */
    _getLargestLeaf(parent) {
        const l = left(parent);
        const r = right(parent);

        if (r < this._heap.length && 0 > this._compare(l, r)) {
            return r;
        }

        return l;
    }

    /**
     * @param {int} node
     *
     * @private
     */
    _siftDown(node) {
        const last = Math.floor(this._heap.length / 2);

        let leaf;
        for (let parent = node; parent < last; parent = leaf) {
            // Get the largest leaf to eventually swap with the parent
            leaf = this._getLargestLeaf(parent);

            if (0 < this._compare(parent, leaf)) {
                break;
            }

            this._swap(parent, leaf);
        }
    }

    /**
     * @param {int} leaf
     *
     * @private
     */
    _siftUp(leaf) {
        let p;
        for(; 0 < leaf; leaf = p) {
            p = parent(leaf);

            if (0 > this._compare(leaf, p)) {
                break;
            }

            this._swap(p, leaf);
        }
    }

    /**
     * @param {int} node
     *
     * @private
     */
    _setRoot(node) {
        this._heap[0] = node;
        this._siftDown(0);
    }

    /**
     * @returns {*}
     *
     * @private
     */
    _getRoot() {
        return this._heap[0];
    }
}

global.PriorityQueue = PriorityQueue;
