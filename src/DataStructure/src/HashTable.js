const GenericCollectionTrait = require('./Traits/GenericCollectionTrait');
const INITIAL_SIZE = 64;

/**
 * Hashing function.
 * Returns an unsigned integer between 0 and 2^32-1
 *
 * @param {string} str
 * @returns {int}
 */
const hash = (str) => {
    let hash = 5381,
        i = str.length;

    while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    /*
     * JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift.
     */
    return hash >>> 0;
};

const isNumericInt = (val) => ~~val == val;

class Entry {
    constructor(key, value) {
        /**
         * @type {int}
         */
        this.hashCode = isNumericInt(key) ? ~~key : hash(String(key));

        /**
         * @type {string}
         */
        this.key = String(key);

        /**
         * @type {*}
         */
        this.value = value;

        /**
         * @type {undefined|Entry}
         */
        this.next = undefined;

        /**
         * @type {undefined|Entry}
         */
        this.prev = undefined;
    }
}

class HashTable extends mix(undefined, GenericCollectionTrait) {
    /**
     * Constructor.
     *
     * @param {int} [bucketSize=INITIAL_SIZE]
     */
    constructor(bucketSize = INITIAL_SIZE) {
        super();

        /**
         * @type {int}
         * @private
         */
        this._bucketSize = bucketSize;
        this.clear();
    }

    clear() {
        /**
         * @type {[Entry]}
         * @private
         */
        this._buckets = Array(this._bucketSize).fill(undefined);

        /**
         * @type {Entry}
         * @private
         */
        this._first = undefined;

        /**
         * @type {Entry}
         * @private
         */
        this._last = undefined;

        /**
         * @type {int}
         * @private
         */
        this._length = 0;

        /**
         * @type {int}
         * @private
         */
        this._lastNumericIdx = 0;
    }

    /**
     * @inheritDoc
     */
    get length() {
        return this._length;
    }

    /**
     * Gets the first element of the collection.
     *
     * @returns {*}
     */
    get first() {
        return this._first ? this._first.value : undefined;
    }

    /**
     * Gets the last element of the collection.
     *
     * @returns {*}
     */
    get last() {
        return this._last ? this._last.value : undefined;
    }

    /**
     * Inserts the key-value pair into the symbol table, overwriting the old value
     * with the new value if the key is already in the symbol table.
     *
     * @param {int|string} key
     * @param {*} value
     *
     * @throws InvalidArgumentException if key is null or undefined
     */
    put(key, value) {
        if (undefined === key || null === key) {
            throw new InvalidArgumentException('Key cannot be null or undefined');
        }

        const entry = new Entry(key, value);
        const bucketIdx = entry.hashCode % this._bucketSize;

        try {
            if (this._buckets[bucketIdx] === undefined) {
                this._buckets[bucketIdx] = entry;
                this._add(entry);
                return;
            }

            let e = this._buckets[bucketIdx];
            do {
                if (e.key === entry.key) {
                    e.value = entry.value;
                    return;
                }
            } while (e = e.next && e.hashCode % this._bucketSize === bucketIdx);

            this._add(entry);
        } finally {
            if (undefined === this._first) {
                this._first = entry;
            }

            if (isNumericInt(key) && this._lastNumericIdx <= key) {
                this._lastNumericIdx = key + 1;
            }
        }
    }

    /**
     * @inheritDoc
     */
    copy() {
        const copy = new HashTable(this._bucketSize);
        for (let e = this._first; undefined !== e; e = e.next) {
            copy.put(e.key, e.value);
        }

        return copy;
    }

    /**
     * Pushes a new value into the collection.
     *
     * @param {*} value
     */
    push(value) {
        this.put(this._lastNumericIdx, value);
    }

    /**
     * Pops out an entry from the end of the collection.
     *
     * @returns {*}
     */
    pop() {
        const last = this._last;
        if (undefined === last) {
            return undefined;
        }

        this._last = this._last.prev;
        this._last.next = undefined;
        this._length--;

        return last.value;
    }

    /**
     * Gets the value associated with key, if set.
     *
     * @param {int|string} key
     *
     * @returns {undefined|*}
     */
    get(key) {
        const e = this._search(key);

        return undefined !== e ? e.value : undefined;
    }

    /**
     * Returns if a key is present in the table.
     *
     * @param {int|string} key
     *
     * @returns {boolean}
     */
    has(key) {
        const hashCode = isNumericInt(key) ? ~~key : hash(String(key));
        const bucketIdx = hashCode % this._bucketSize;
        let e = this._buckets[bucketIdx];

        if (e === undefined) {
            return false;
        }

        while (e !== undefined) {
            if (e.key == key) {
                return true;
            }

            e = e.next;
        }

        return false;
    }

    /**
     * Removes an element from the collection.
     *
     * @param {int|string} key
     *
     * @returns {undefined}
     */
    remove(key) {
        const e = this._search(key);
        if (undefined === e) {
            return;
        }

        const prev = e.prev;
        const next = e.next;
        this._length--;

        if (e !== this._first) {
            prev.next = next;
        } else {
            this._first = next;
        }

        if (e !== this._last) {
            next.prev = prev;
        } else {
            this._last = prev;
        }

        return undefined !== e ? e.value : undefined;
    }

    /**
     * @inheritDoc
     */
    toArray() {
        if (undefined === this._first) {
            return [];
        }

        return Array.from(this);
    }

    /**
     * Returns an array or a literal object with all the elements
     * of the collection.
     *
     * @returns {Array|Object}
     */
    toObject() {
        const resolve = (val) => val instanceof HashTable ? val.toObject() : val;

        const entries = this.toArray();
        const isArray = (() => {
            if (0 === this._length) {
                return false;
            }

            if (this._length !== this._lastNumericIdx) {
                return false;
            }

            for (let i = 0; i < entries.length; i++) {
                if (entries[i][0] != i) {
                    return false;
                }
            }

            return true;
        })();

        if (isArray) {
            return entries.map(e => resolve(e[1]));
        }

        return entries.reduce((res, val) => (res[val[0]] = resolve(val[1]), res), {});
    }

    /**
     * Creates an HashTable from an object or array.
     *
     * @param {Object|Array} obj
     *
     * @returns {HashTable}
     */
    static fromObject(obj) {
        const table = new HashTable();
        for (const [ key, value ] of __jymfony.getEntries(obj)) {
            table.put(key, value);
        }

        return table;
    }

    /**
     * Returns all the table keys (ordered).
     *
     * @returns {[]}
     */
    keys() {
        return Array.from(this)
            .map(tuple => tuple[0]);
    }

    /**
     * Iterate over all the collection elements.
     */
    * [Symbol.iterator]() {
        if (undefined === this._first) {
            return;
        }

        let e = this._first;

        do {
            yield [ e.key, e.value ];
        } while (e = e.next);
    }

    /**
     * Helper method to add an entry to the collection.
     *
     * @param {Entry} entry
     * @private
     */
    _add(entry) {
        if (undefined !== this._last) {
            this._last.next = entry;
        }

        entry.prev = this._last;
        this._last = entry;
        this._length++;
    }

    /**
     * Searches an entry with key.
     *
     * @param key
     * @returns {Entry|undefined}
     *
     * @private
     */
    _search(key) {
        const hashCode = isNumericInt(key) ? ~~key : hash(String(key));
        const bucketIdx = hashCode % this._bucketSize;
        let e = this._buckets[bucketIdx];

        if (e === undefined) {
            return;
        }

        while (e !== undefined && e.key != key) {
            e = e.next;
        }

        return e;
    }
}

global.HashTable = HashTable;
