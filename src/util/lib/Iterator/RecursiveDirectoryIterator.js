const { readdirSync, statSync } = require('fs');
const { sep } = require('path');

class RecursiveDirectoryIterator {
    /**
     * Constructor.
     *
     * @param {string} filepath
     */
    constructor(filepath) {
        /**
         * @type {string}
         *
         * @private
         */
        this._path = filepath;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._dir = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._current = undefined;
    }

    /**
     * Make this object iterable.
     *
     * @returns {RecursiveDirectoryIterator}
     */
    [Symbol.iterator]() {
        return this;
    }

    /**
     * Iterates over values.
     *
     * @returns { {done: boolean, value?: string} }
     */
    next() {
        if (undefined === this._dir) {
            try {
                this._dir = readdirSync(this._path);
            } catch {
                this._dir = [];
            }
        }

        if (undefined === this._current && 0 === this._dir.length) {
            return { done: true };
        }

        if (undefined === this._current) {
            let stat;
            this._current = this._path + sep + this._dir.shift();

            try {
                stat = statSync(this._current);
            } catch {
                this._current = undefined;

                return this.next();
            }

            this._current = stat.isDirectory() ? new RecursiveDirectoryIterator(this._current) : this._current;
        }

        if (this._current instanceof RecursiveDirectoryIterator) {
            const next = this._current.next();
            if (next.done) {
                const current = this._current;
                this._current = undefined;

                return { value: current._path, done: false };
            }

            return next;
        }

        const current = this._current;
        this._current = undefined;

        return { value: current, done: false };
    }
}

globalThis.RecursiveDirectoryIterator = RecursiveDirectoryIterator;
