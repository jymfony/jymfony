import { statSync } from 'fs';

const FileLocatorInterface = Jymfony.Component.Metadata.Loader.Locator.FileLocatorInterface;

/**
 * @memberOf Jymfony.Component.Metadata.Loader.Locator
 */
export default class IteratorFileLocator extends implementationOf(FileLocatorInterface) {
    /**
     * @inheritdoc
     */
    locate(basePath, extension) {
        if ('.' !== extension[0]) {
            throw new InvalidArgumentException('Extension argument must start with a dot');
        }

        return [ ...this._doLocate(basePath, extension) ];
    }

    /**
     * Iterate recursively the directories and yield matching files.
     *
     * @param {string} basePath
     * @param {string} extension
     *
     * @returns {Generator<string>}
     *
     * @private
     */
    * _doLocate(basePath, extension) {
        const regex = new RegExp(__jymfony.regex_quote(extension) + '$', 'i');
        for (const path of new RecursiveDirectoryIterator(basePath)) {
            if (! path.match(regex)) {
                continue;
            }

            const stat = statSync(path);
            if (stat.isFile()) {
                yield path;
            }
        }
    }
}
