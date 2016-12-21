const ConfigCacheInterface = Jymfony.Config.ConfigCacheInterface;
const fs = require('fs');

/**
 * @memberOf Jymfony.Config
 * @type {Jymfony.Config.ResourceCheckerConfigCache}
 */
module.exports = class ResourceCheckerConfigCache extends implementationOf(ConfigCacheInterface) {
    /**
     * Create a config cache with resource checkers
     *
     * @param {string} file
     * @param {Jymfony.Config.ResourceCheckerInterface[]} resourceCheckers
     */
    constructor(file, resourceCheckers = []) {
        this._file = file;
        this._checkers = resourceCheckers;
    }

    /**
     * {@inheritDoc}
     */
    getPath() {
        return this._file;
    }

    /**
     * {@inheritDoc}
     */
    isFresh() {
        if (! fs.existsSync(this._file)) {
            return false;
        }

        if (0 === this._checkers.length) {
            return true;
        }

        let metadata = this._getMetaFile();
        if (! fs.existsSync(metadata)) {
            return true;
        }

        let stat = fs.statSync(metadata);
        let time = stat.mtime;
        let meta = JSON.parse(fs.readFileSync(metadata));

        for (let resource of __jymfony.getEntries(meta)) {
            for (let checker of this._checkers) {
                if (! checker.supports(resource)) {
                    continue;
                }

                if (checker.isFresh(resource, time)) {
                    break;
                }

                return false;
            }

            // No checker found
        }

        return true;
    }

    /**
     * {@inheritDoc}
     */
    write(content, metadata = undefined) {
        let umask = process.umask();
        let mode = 0o666 & ~umask;

        fs.writeFileSync(this._file, content);
        try {
            fs.chmodSync(this._file, mode);
        } catch (err) {
            // Ignore chmod
        }

        if (metadata) {
            fs.writeFileSync(this._getMetaFile(), JSON.stringify(metadata));
            try {
                fs.chmodSync(this._getMetaFile(), mode);
            } catch (err) {
                // Ignore this error too
            }
        }
    }

    _getMetaFile() {
        return this._file + '.meta';
    }
};
