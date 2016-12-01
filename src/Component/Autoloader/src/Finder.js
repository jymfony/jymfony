// Cache root dir value
let root = undefined;

module.exports = class Finder {
    constructor(fs = require('fs'), path = require('path'), currentModule = module) {
        this._fs = fs;
        this._path = path;
        this._currentModule = currentModule;
    }

    findRoot() {
        if (undefined === root) {
            let current = this._getMainModule();

            let parts = this._path.dirname(current.filename).split(this._path.sep);
            for (; parts.length; parts.pop()) {
                let packageJson = this._normalizePath(parts, 'package.json');

                let stat;

                try {
                    stat = this._fs.statSync(packageJson);
                } catch (e) {
                    continue;
                }

                if (! stat.isFile()) {
                    continue;
                }

                root = this._normalizePath(parts);
                break;
            }
        }

        return root;
    }

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
            let dir = this._path.join(...parts, 'node_modules');
            let stat;

            try {
                stat = this._fs.statSync(dir);
            } catch (e) {
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
