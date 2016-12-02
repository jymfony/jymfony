module.exports = class Finder {
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
                let stat = this._fs.statSync(fileName);

                return {
                    filename: fileName,
                    directory: stat.isDirectory()
                };
            } catch (e) {
                if (! e.code || e.code !== 'ENOENT') {
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
     * Get application root dir, based on root module
     *
     * @returns {string|undefined}
     */
    findRoot() {
        if (undefined === this._root) {
            let current = this._getMainModule();

            let parts = this._path.dirname(current.filename).split(this._path.sep);
            for (; parts.length; parts.pop()) {
                let root = this._normalizePath(parts);

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
        let root = this.findRoot();
        let parts = root.split(this._path.sep);

        let processor = function * (list) {
            for (let name of list) {
                if ('.' === name[0]) {
                    continue;
                }

                yield name;
            }
        };

        for (; parts.length; parts.pop()) {
            let dir = this._normalizePath(parts, 'node_modules');
            let stat;

            try {
                stat = this._fs.statSync(dir);
            } catch (e) {
                if (! e.code || e.code !== 'ENOENT') {
                    throw e;
                }

                continue;
            }

            if (! stat.isDirectory()) {
                continue;
            }

            return Array.from(processor(this._fs.readdirSync(dir)));
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

    _normalizePath(parts, fileName)
    {
        if ('/' !== this._path.sep) {
            throw new Error('Verify this on Windows!');
        }

        return `/${this._path.join(...parts, (fileName || ''))}`;
    }
};
