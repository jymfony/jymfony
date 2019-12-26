import { existsSync, realpathSync, statSync } from 'fs';
import { basename } from 'path';
import { createHash } from 'crypto';

const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * DirectoryResource represents a resources stored in a subdirectory tree.
 *
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class DirectoryResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * @param {string} resource The file path to the resource
     * @param {null|RegExp} [pattern] A pattern to restrict monitored files
     *
     * @throws {InvalidArgumentException}
     */
    __construct(resource, pattern = null) {
        /**
         * @type {string|boolean}
         *
         * @private
         */
        this._resource = existsSync(resource) ? realpathSync(resource) : false;

        /**
         * @type {null|RegExp}
         *
         * @private
         */
        this._pattern = pattern;

        if (false === this._resource || ! statSync(this._resource).isDirectory()) {
            throw new InvalidArgumentException(__jymfony.sprintf('The directory "%s" does not exist.', resource));
        }
    }

    /**
     * @inheritdoc
     */
    toString() {
        const hash = createHash('md5');
        hash.update(__jymfony.serialize([ this._resource, this._pattern ]));

        return hash.digest().toString('hex');
    }

    /**
     * @returns {string} The file path to the resource
     */
    get resource() {
        return this._resource;
    }

    /**
     * Returns the pattern to restrict monitored files.
     *
     * @returns {string|null}
     */
    get pattern() {
        return this._pattern;
    }

    /**
     * @inheritdoc
     */
    isFresh(timestamp) {
        let stat;
        try {
            stat = statSync(this._resource);
        } catch (e) {
            return false;
        }

        if (! stat.isDirectory()) {
            return false;
        }

        if (timestamp < ~~(stat.mtimeMs / 1000)) {
            return false;
        }

        for (const file of new RecursiveDirectoryIterator(this._resource)) {
            const stat = statSync(file);

            // If regex filtering is enabled only check matching files
            if (null !== this._pattern && stat.isFile() && ! basename(file).match(this._pattern)) {
                continue;
            }

            // Always monitor directories for changes, except the .. entries
            // (otherwise deleted files wouldn't get detected)
            if (stat.isDirectory() && '/..' === file.substr(-3)) {
                continue;
            }

            const fileMTime = ~~(stat.mtimeMs / 1000);

            // Early return if a file's mtime exceeds the passed timestamp
            if (timestamp < fileMTime) {
                return false;
            }
        }

        return true;
    }
}
