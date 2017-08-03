const FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
const FileLocatorFileNotFoundException = Jymfony.Component.Config.Exception.FileLocatorFileNotFoundException;

const fs = require('fs');
const path = require('path');

/**
 * @memberOf Jymfony.Component.Config
 */
class FileLocator extends implementationOf(FileLocatorInterface) {
    /**
     * Constructor.
     *
     * @param {[string]|string} paths
     */
    __construct(paths = []) {
        /**
         * @type {[string]}
         * @private
         */
        this._paths = isArray(paths) ? paths : [ paths ];
    }

    /**
     * @inheritDoc
     */
    locate(name, currentPath = undefined, first = true) {
        if (! name) {
            throw new InvalidArgumentException('An empty file name is not valid to be located.');
        }

        if (path.isAbsolute(name)) {
            if (! fs.existsSync(name)) {
                throw new FileLocatorFileNotFoundException(__jymfony.sprintf('The file "%s" does not exist.', name), 0, undefined, [ name ]);
            }

            return name;
        }

        let paths = this._paths;
        if (undefined !== currentPath) {
            paths.unshift(currentPath);
        }

        paths = new Set(paths);
        let filepaths = [], notfound = [];

        for (let filePath of paths) {
            let file;
            if (fs.existsSync(file = path.join(filePath, name))) {
                if (first) {
                    return file;
                }

                filepaths.push(file);
            } else {
                notfound.push(file);
            }
        }

        if (0 === filepaths.length) {
            throw new FileLocatorFileNotFoundException(__jymfony.sprintf('The file "%s" does not exist (in: %s).', name, Array.from(paths).join(', ')), 0, undefined, notfound);
        }

        return filepaths;
    }
}

module.exports = FileLocator;
