const GenericCollectionTrait = require('./Traits/GenericCollectionTrait');

// Integer compare function
const compare_func = (a, b) => {
    if (a == b) {
        return 0;
    } else if (a > b) {
        return 1;
    }
    return -1;
};

// internal nodes: only use key and next
// external nodes: only use key and value
class Entry {
    /**
     * @param {*} key
     * @param {*} val
     * @param {Node} next
     */
    constructor(key, val, next) {
        this.key = key;
        this.val = val;

        /**
         * Helper field to iterate over entries.
         *
         * @type {Node}
         */
        this.next = next;
    }
}

// helper B-tree node data type
class Node {
    // create a node with k children
    constructor(k) {
        this.m = k;

        /**
         * @type {Array<Entry>}
         */
        this.children = [];
    }
}

/**
 * BTree
 *
 * @type {BTree}
 */
global.BTree = class BTree extends mix(undefined, GenericCollectionTrait) {
    /**
     * Comparison function can be defined passing it to cmp_function parameter.
     * The function should return 0 if elements are equals, 1 if the first argument
     * is greater of the second, -1 if is lesser.
     *
     * @param {Function} cmp_function
     */
    constructor(cmp_function = compare_func) {
        super();

        /**
         * Root node.
         *
         * @type {Node}
         * @private
         */
        this._root = new Node(0);

        /**
         * The height of the BTree.
         *
         * @type {int}
         * @private
         */
        this._height = 0;

        /**
         * The number of nodes in the BTree.
         *
         * @type {int}
         * @private
         */
        this._length = 0;

        /**
         * The key compare function.
         *
         * @type {Function}
         * @private
         */
        this._cmp_function = cmp_function;
    }

    /**
     * The number of elements into the tree.
     *
     * @returns {int}
     */
    get length() {
        return this._length;
    }

    /**
     * Returns the height of this BTree (for debugging).
     *
     * @returns {int}
     */
    get height() {
        return this._height;
    }

    /**
     * Search an entry.
     * Returns a key-value pair with the exact key if found or:
     *  * if comparison is set to COMPARISON_LESS, the nearest lesser key.
     *  * if comparison is set to COMPARISON_GREATER, the nearest greater key.
     *  * undefined otherwise
     *
     * @param {*} key
     * @param {int} comparison
     *
     * @returns {Array} Gets a key-value pair if found or undefined
     */
    search(key, comparison = BTree.COMPARISON_EQUAL) {
        let lt = (a, b) => this._cmp_function(a, b) < 0;

        let search = (node, key, height) => {
            let children = node.children;
            let nearest = undefined;

            if (height == 0) {      // external node
                for (let j = 0; j < node.m; j++) {
                    let compare = this._cmp_function(key, children[j].key);
                    if (compare == 0) {
                        return children[j];
                    } else if (BTree.COMPARISON_LESS === comparison && compare > 0) {
                        nearest = children[j];
                    } else if (BTree.COMPARISON_GREATER === comparison && compare < 0) {
                        return children[j];
                    }
                }
            } else {                // internal node
                for (let j = 0; j < node.m; j++) {
                    if (j + 1 == node.m || lt(key, children[j + 1].key)) {
                        let result = search(children[j].next, key, height - 1);
                        if (undefined !== result) {
                            return result;
                        }
                    }
                }
            }

            return nearest;
        };

        let result = search(this._root, key, this._height);
        if (undefined !== result) {
            result = [result.key, result.val];
        }

        return result;
    }

    /**
     * Gets a value.
     *
     * @param key
     *
     * @returns {*}
     */
    get(key) {
        return this.search(key)[1];
    }

    /**
     * Inserts the key-value pair into the symbol table, overwriting the old value
     * with the new value if the key is already in the symbol table.
     *
     * @param {*} key
     * @param {*} val
     *
     * @throws InvalidArgumentException if key is null or undefined
     */
    push(key, val) {
        let lt = (a, b) => this._cmp_function(a, b) < 0;

        /**
         * Splits a node.
         *
         * @param {Node} root
         *
         * @returns {Node}
         * @private
         */
        let split = (root) => {
            let t = new Node(2);
            root.m = 2;

            for (let j = 0; j < 2; j++){
                t.children[j] = root.children[2 + j];
            }

            return t;
        };

        /**
         * Insert/replace a node.
         *
         * @param {Node} root
         * @param {*} key
         * @param {*} val
         * @param {int} height
         *
         * @returns {undefined|boolean|Node}
         * @private
         */
        let insert = (root, key, val, height) => {
            let j;
            let newEntry = new Entry(key, val, undefined);

            if (height == 0) {      // external node
                for (j = 0; j < root.m; j++) {
                    let compare = this._cmp_function(key, root.children[j].key);
                    if (compare == 0) {
                        root.children[j].val = val;
                        return true;
                    }

                    if (compare < 0) {
                        break;
                    }
                }
            } else {            // internal node
                for (j = 0; j < root.m; j++) {
                    if ((j+1 == root.m) || lt(key, root.children[j+1].key)) {
                        let u = insert(root.children[j++].next, key, val, height-1);
                        if (! u || true === u) {
                            return u;
                        }
                        
                        newEntry.key = u.children[0].key;
                        newEntry.next = u;
                        break;
                    }
                }
            }

            for (let i = root.m; i > j; i--) {
                root.children[i] = root.children[i - 1];
            }

            root.children[j] = newEntry;
            root.m++;

            if (root.m < 4) {
                return undefined;
            }

            return split(root);
        };

        if (key === null || key === undefined) {
            throw new InvalidArgumentException("Key cannot be null or undefined");
        }

        let u = insert(this._root, key, val, this._height);
        if (true === u) {
            return;
        }

        this._length++;

        if (! u) {
            return;
        }

        // need to split root
        let t = new Node(2);
        t.children[0] = new Entry(this._root.children[0].key, undefined, this._root);
        t.children[1] = new Entry(u.children[0].key, undefined, u);

        this._root = t;
        this._height++;
    }

    /**
     * Removes an entry by key.
     *
     * @param {*} key
     */
    remove(key) {
        let eq = (a, b) => this._cmp_function(a, b) == 0;
        let lt = (a, b) => this._cmp_function(a, b) < 0;

        let search = (node, key, height) => {
            let children = node.children;

            if (height == 0) {      // external node
                for (let j = 0; j < node.m; j++) {
                    if (eq(key, children[j].key)) {
                        this._length--;
                        node.m--;

                        delete children[j];
                        return;
                    }
                }
            } else {                // internal node
                for (let j = 0; j < node.m; j++) {
                    if (j + 1 == node.m || lt(key, children[j + 1].key)) {
                        return search(children[j].next, key, height - 1);
                    }
                }
            }
        };

        search(this._root, key, this._height);
    }

    /**
     * Gets an element array copy (ordered)
     *
     * @returns {Array}
     */
    toArray() {
        return Array.from(this[Symbol.iterator]())
    }

    /**
     * Iterator (used in for..of loops)
     *
     * @returns {Generator}
     */
    * [Symbol.iterator]() {
        let generator = function * (h, ht) {
            let children = h.children;

            if (ht == 0) {
                for (let j = 0; j < h.m; j++) {
                    yield [ children[j].key, children[j].val ];
                }
            } else {
                for (let j = 0; j < h.m; j++) {
                    yield * generator(children[j].next, ht-1);
                }
            }
        };

        yield * generator(this._root, this._height);
    }
};

BTree.COMPARISON_EQUAL = 0;
BTree.COMPARISON_LESS = -1;
BTree.COMPARISON_GREATER = 1;
