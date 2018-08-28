const File = Jymfony.Component.Filesystem.File;
const StreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapper;
const path = require('path');

/**
 * @memberOf Jymfony.Component.Filesystem.Iterator
 */
class RecursiveDirectoryIterator {
    /**
     * Constructor.
     *
     * @param {string} filepath
     * @param {int} [flags = 0]
     */
    __construct(filepath, flags = 0) {
        const url = File.resolve(filepath);

        /**
         * @type {string}
         *
         * @private
         */
        this._path = url.href;
        if ('file:' === url.protocol && __jymfony.Platform.isWindows() && url.host) {
            this._path = url.protocol + '//' + url.host.toUpperCase() + ':' + url.path.replace(/\//g, path.sep);
        }

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

    /**
     * Iterates over values.
     *
     * @returns {Promise<{done: boolean, value: string}>}
     */
    async next() {
        const streamWrapper = StreamWrapper.get(this._path);
        if (undefined === this._dir) {
            /**
             * @type {string[]}
             *
             * @private
             */
            this._dir = await streamWrapper.readdir(this._path);

            /**
             * @type {string[]}
             *
             * @private
             */
            this._after = [];
        }

        if (undefined === this._current && 0 === this._dir.length) {
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
            this._current = this._path + path.sep + this._dir.shift();
            const stat = await streamWrapper.stat(this._current, { stat_link: ! this._followSymlinks });
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
