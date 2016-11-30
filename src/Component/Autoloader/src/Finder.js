const path = require('path');
const fs   = require('fs');

let root   = undefined;

module.exports = class Finder {
    findRoot() {
        if (undefined === root) {
            let current = this._getMainModule();

            let parts = path.dirname(current.filename).split(path.sep);
            for (; parts.length; parts.pop()) {
                let packageJson;
                if (path.sep == '/') {
                    packageJson = '/' + path.join(...parts, 'package.json');
                } else {
                    throw new Error('Verify this on Windows!');
                }

                let stat;

                try {
                    stat = fs.statSync(packageJson);
                } catch (e) {
                    continue;
                }

                if (! stat.isFile()) {
                    continue;
                }

                if (path.sep == '/') {
                    root = '/' + path.join(...parts);
                } else {
                    throw new Error('Verify this on Windows!');
                }
                break;
            }
        }

        return root;
    }

    listModules() {
        let root = this.findRoot();
        let parts = root.split(path.sep);

        let processor = function * (list) {
            for (let name of list) {
                if (name[0] === '.') {
                    continue;
                }

                yield name;
            }
        };

        for (; parts.length; parts.pop()) {
            let dir = path.join(...parts, 'node_modules');
            let stat;

            try {
                stat = fs.statSync(dir);
            } catch (e) {
                continue;
            }

            if (! stat.isDirectory()) {
                continue;
            }

            return Array.from(processor(fs.readdirSync(dir)));
        }

        return [];
    }

    _getMainModule() {
        let current = module;
        while (current.parent) {
            current = current.parent;
        }

        return current;
    }
};
