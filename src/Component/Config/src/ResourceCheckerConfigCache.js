const ConfigCacheInterface = Jymfony.Component.Config.ConfigCacheInterface;
const fs = require('fs');

/**
 * @memberOf Jymfony.Component.Config
 */
class ResourceCheckerConfigCache extends implementationOf(ConfigCacheInterface) {
    /**
     * Create a config cache with resource checkers
     *
     * @param {string} file
     * @param {Jymfony.Component.Config.ResourceCheckerInterface[]} resourceCheckers
     */
    __construct(file, resourceCheckers = []) {
        super.__construct();

        this._file = file;
        this._checkers = resourceCheckers;
    }

    /**
     * @inheritdoc
     */
    getPath() {
        return this._file;
    }

    /**
     * @inheritdoc
     */
    isFresh() {
        if (! fs.existsSync(this._file)) {
            return false;
        }

        if (0 === this._checkers.length) {
            return true;
        }

        const metadata = this._getMetaFile();
        if (! fs.existsSync(metadata)) {
            return true;
        }

        const stat = fs.statSync(metadata);
        const time = stat.mtime;
        const meta = __jymfony.unserialize(fs.readFileSync(metadata));

        for (const resource of Object.values(meta)) {
            for (const checker of this._checkers) {
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
     * @inheritdoc
     */
    write(content, metadata = undefined) {
        const umask = process.umask();
        const mode = 0o666 & ~umask;

        fs.writeFileSync(this._file, content);
        try {
            fs.chmodSync(this._file, mode);
        } catch (err) {
            // Ignore chmod
        }

        if (metadata) {
            fs.writeFileSync(this._getMetaFile(), __jymfony.serialize(metadata));
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
}

module.exports = ResourceCheckerConfigCache;
