const BaseLocator = Jymfony.Component.Config.FileLocator;

/**
 * FileLocator uses the KernelInterface to locate resources in bundles.
 *
 * @memberOf Jymfony.Component.Kernel.Config
 */
class FileLocator extends BaseLocator {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Kernel.KernelInterface} kernel
     * @param {string} path
     * @param {[string]|string} paths
     */
    __construct(kernel, path = undefined, paths = []) {
        /**
         * @type {Jymfony.Component.Kernel.KernelInterface}
         * @private
         */
        this._kernel = kernel;

        /**
         * @type {string}
         * @private
         */
        this._path = path;

        super.__construct(paths);
    }

    /**
     * @inheritDoc
     */
    locate(file, currentPath = undefined, first = true) {
        if ('@' === file.charAt(0)) {
            return this._kernel.locateResource(file, this._path, first);
        }

        return super.locate(file, currentPath, first);
    }
}

module.exports = FileLocator;
