const fs = require('fs');
const path = require('path');

/**
 * @memberOf Jymfony.Component.Config.Resource.Iterator
 */
export default class RecursiveDirectoryIterator {
    /**
     * Constructor.
     *
     * @param {string} filepath
     */
    __construct(filepath) {
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
     * @returns {Jymfony.Component.Config.Resource.Iterator.RecursiveDirectoryIterator}
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
            this._dir = fs.readdirSync(this._path);
        }

        if (undefined === this._current && 0 === this._dir.length) {
            return { done: true };
        }

        if (undefined === this._current) {
            this._current = this._path + path.sep + this._dir.shift();
            const stat = fs.statSync(this._current, { stat_link: true });
            this._current = stat.isDirectory() ? new __self(this._current) : this._current;
        }

        if (this._current instanceof __self) {
            const next = this._current.next();
            if (next.done) {
                this._current = undefined;

                return this.next();
            }

            return next;
        }

        const current = this._current;
        this._current = undefined;

        return { value: current, done: false };
    }
}
