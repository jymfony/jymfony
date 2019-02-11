/**
 * @memberOf Jymfony.Component.Autoloader
 */
class Finder {
    /**
     * Constructor.
     *
     * @param {NodeRequire} req
     * @param {module:fs} fs
     * @param {module:path} path
     */
    constructor(req = require, fs = undefined, path = undefined) {
        /**
         * @type {NodeRequire}
         *
         * @private
         */
        this._require = req;

        /**
         * @type {module:fs}
         *
         * @private
         */
        this._fs = fs || req('fs');

        /**
         * @type {module:path}
         *
         * @private
         */
        this._path = path || req('path');

        /**
         * Cache root dir value
         *
         * @type {string}
         *
         * @private
         */
        this._root = undefined;
    }

    /**
     * Searches for file/folder in base dir
     *
     * @param {string} baseDir
     * @param {string} name
     *
     * @returns {Object}
     */
    find(baseDir, name) {
        let fileName = this._path.normalize(baseDir + this._path.sep + name);

        for (let i = 2;;) {
            try {
                const stat = this._fs.statSync(fileName);

                return {
                    filename: fileName,
                    directory: stat.isDirectory(),
                };
            } catch (e) {
                if (! e.code || 'ENOENT' !== e.code) {
                    throw e;
                }

                if (--i) {
                    fileName += '.js';
                    continue;
                }

                break;
            }
        }

        return undefined;
    }

    /**
     * @param {string} fn
     */
    load(fn) {
        return this._fs.readFileSync(fn, 'utf-8');
    }

    /**
     * Get application root dir, based on root module
     *
     * @returns {string|undefined}
     */
    findRoot() {
        if (undefined === this._root) {
            if (process.env.LAMBDA_TASK_ROOT) {
                return this._root = process.env.LAMBDA_TASK_ROOT;
            }

            const current = this._getMainModule();

            const parts = this._path.dirname(current.filename).split(this._path.sep);
            for (; parts.length; parts.pop()) {
                const root = this._normalizePath(parts);

                if (this.find(root, 'package.json')) {
                    this._root = root;
                    break;
                }
            }
        }

        return this._root;
    }

    /**
     * Get module names list
     * Note that this will return top-level modules ONLY
     *
     * @returns {IterableIterator|Array}
     */
    listModules() {
        const root = this.findRoot();
        const parts = root.split(this._path.sep);
        let firstLevel = true;
        const self = this;
        let currentDir;

        const rd = function (dir, ignoreErrors = false) {
            let stat;

            try {
                dir = self._fs.realpathSync(dir);
                stat = self._fs.statSync(dir);

                if (stat.isDirectory()) {
                    return self._fs.readdirSync(dir);
                }

                const e = new Error();
                e.code = 'ENOENT';

                throw e;
            } catch (e) {
                if (! ignoreErrors || 'ENOENT' === e.code) {
                    throw e;
                }
            }

            return [];
        };

        const processor = function * (list) {
            for (const name of list) {
                if ('.' === name[0]) {
                    continue;
                }

                if (firstLevel && '@' === name[0]) {
                    firstLevel = false;

                    for (const sub of processor(rd(self._path.join(currentDir, name), true))) {
                        yield name + '/' + sub;
                    }

                    firstLevel = true;
                } else {
                    yield name;
                }
            }
        };

        for (; parts.length; parts.pop()) {
            currentDir = this._normalizePath(parts, 'node_modules');

            try {
                return processor(rd(currentDir));
            } catch (e) {
                if ('ENOENT' !== e.code) {
                    throw e;
                }
            }
        }

        return [];
    }

    /**
     * @returns {NodeModule}
     *
     * @private
     */
    _getMainModule() {
        return this._require.main;
    }

    /**
     * @param {string[]} parts
     * @param {string} fileName
     *
     * @returns {string}
     *
     * @private
     */
    _normalizePath(parts, fileName) {
        const joined = this._path.join(...parts, (fileName || ''));
        if ('/' !== this._path.sep) {
            return joined;
        }

        return `/${joined}`;
    }
}

module.exports = Finder;
