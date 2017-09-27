/**
 * @memberOf Jymfony.Component.Autoloader
 */
class Finder {
    constructor(fs = require('fs'), path = require('path'), currentModule = module) {
        this._fs = fs;
        this._path = path;
        this._currentModule = currentModule;

        // Cache root dir value
        this._root = undefined;
    }

    /**
     * Searches for file/folder in base dir
     *
     * @param baseDir
     * @param name
     *
     * @returns object
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
     * @returns {Array}
     */
    listModules() {
        const root = this.findRoot();
        const parts = root.split(this._path.sep);
        let firstLevel = true;
        const self = this;
        let currentDir;

        const rd = function * (dir, ignoreErrors = false) {
            let stat;

            try {
                dir = self._fs.realpathSync(dir);
                stat = self._fs.statSync(dir);
            } catch (e) {
                if (! ignoreErrors) {
                    throw e;
                }

                return;
            }

            if (! stat.isDirectory()) {
                const e = new Error();
                e.code = 'ENOENT';

                throw e;
            }

            yield * self._fs.readdirSync(dir);
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
                return Array.from(processor(rd(currentDir)));
            } catch (e) {
                if (! e.code || 'ENOENT' !== e.code) {
                    throw e;
                }
            }
        }

        return [];
    }

    _getMainModule() {
        let current = this._currentModule;
        while (current.parent) {
            current = current.parent;
        }

        return current;
    }

    _normalizePath(parts, fileName) {
        const joined = this._path.join(...parts, (fileName || ''));
        if ('/' !== this._path.sep) {
            return joined;
        }

        return `/${joined}`;
    }
}

module.exports = Finder;
