const GenericCollectionTrait = require('./Traits/GenericCollectionTrait');

let left = index => (index * 2) + 1;
let right = index => (index * 2) + 2;
let parent = index => Math.floor((index - 1) / 2);

class PriorityNode {
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
 *
 * @type {PriorityQueue}
 */
global.PriorityQueue = class PriorityQueue extends mix(undefined, GenericCollectionTrait) {
    constructor() {
        super();

        this._heap = [];
        this._stamp = 0;
    }

    /**
     * Empties the queue
     */
    clear() {
        this._heap = [];
        this._stamp = 0;
    }

    /**
     * Make a copy queue
     *
     * @returns {PriorityQueue}
     */
    copy() {
        let copy = new PriorityQueue();

        copy._heap = [ ...this._heap ];
        copy._stamp = this._stamp;

        return copy;
    }

    /**
     * Returns how many elements are in the queue
     *
     * @returns {Number}
     */
    get length() {
        return this._heap.length;
    }

    /**
     * Gets the first element without modifying the queue
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
     * Pop the higher priority value from the queue
     *
     * @returns {*}
     */
    pop() {
        if (this.isEmpty()) {
            throw new UnderflowException();
        }

        let leaf = this._heap.pop();

        if (! this._heap.length) {
            return leaf.value;
        }

        let value = this._getRoot().value;
        this._setRoot(leaf);

        return value;
    }

    /**
     * Push a value into the queue
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
        let heap = [ ...this._heap ];
        let acc = [];

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

    _compare(a, b) {
        let x = this._heap[a];
        let y = this._heap[b];

        return Math.sign(x.priority - y.priority) || Math.sign(y.stamp - x.stamp);
    }

    _swap(a, b) {
        let tmp = this._heap[a];
        this._heap[a] = this._heap[b];
        this._heap[b] = tmp;
    }

    _getLargestLeaf(parent) {
        let l = left(parent);
        let r = right(parent);

        if (r < this._heap.length && 0 > this._compare(l, r)) {
            return r;
        }

        return l;
    }

    _siftDown(node) {
        let last = Math.floor(this._heap.length / 2);

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

    _setRoot(node) {
        this._heap[0] = node;
        this._siftDown(0);
    }

    _getRoot() {
        return this._heap[0];
    }
};
