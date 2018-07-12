const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

/**
 * @memberOf Jymfony.Component.Filesystem.Iterator
 */
class RecursiveDirectoryIterator {
    /**
     * Constructor.
     *
     * @param {string} path
     * @param {int} [flags = 0]
     */
    __construct(path, flags = 0) {
        /**
         * @type {string}
         *
         * @private
         */
        this._path = path;

        /**
         * @type {int}
         *
         * @private
         */
        this._flags = flags;

        /**
         * @type {int}
         *
         * @private
         */
        this._followSymlinks = flags & __self.FOLLOW_SYMLINKS;
    }

    async next() {
        if (undefined === this._dir) {
            this._path = await promisify(fs.realpath)(this._path);

            /**
             * @type {string[]}
             *
             * @private
             */
            this._dir = await promisify(fs.readdir)(this._path);

            /**
             * @type {string[]}
             *
             * @private
             */
            this._after = [];
        }

        if (0 === this._dir.length) {
            if (0 === this._after.length) {
                delete this._dir;
                delete this._after;

                return { done: true };
            }

            if (this._after[0] instanceof __self) {
                const next = await this._after[0].next();
                if (next.done) {
                    this._after.shift();

                    return await this.next();
                }

                return next;
            }

            return { value: this._after.shift(), done: false };
        }

        if (undefined === this._current) {
            this._current = path.join(this._path, this._dir.shift());
            const stat = await promisify(this._followSymlinks ? fs.stat : fs.lstat)(this._current);
            this._current = stat.isDirectory() ? new __self(this._current, this._flags) : this._current;
        }

        switch (this._flags & (__self.CHILD_LAST | __self.CHILD_FIRST)) {
            case 0: {
                if (this._current instanceof __self) {
                    const next = await this._current.next();
                    if (next.done) {
                        delete this._current;

                        return await this.next();
                    }

                    return next;
                }

                const current = this._current;
                delete this._current;

                return { value: current, done: false };
            }

            case __self.CHILD_LAST: {
                if (this._current instanceof __self) {
                    this._after.push(this._current);
                    delete this._current;

                    return await this.next();
                }

                const current = this._current;
                delete this._current;

                return { value: current, done: false };
            }

            case __self.CHILD_FIRST: {
                if (this._current instanceof __self) {
                    const next = await this._current.next();
                    if (next.done) {
                        delete this._current;

                        return await this.next();
                    }

                    return next;
                }

                this._after.push(this._current);
                delete this._current;

                return await this.next();
            }
        }
    }
}

RecursiveDirectoryIterator.CHILD_FIRST = 1;
RecursiveDirectoryIterator.CHILD_LAST = 2;

RecursiveDirectoryIterator.FOLLOW_SYMLINKS = 4;

module.exports = RecursiveDirectoryIterator;
