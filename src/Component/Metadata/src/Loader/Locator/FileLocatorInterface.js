/**
 * @memberOf Jymfony.Component.Metadata.Loader.Locator
 */
class FileLocatorInterface {
    /**
     * Find all files matching $extension extension
     * NOTE: extension MUST start with a dot (.).
     *
     * @param {string} basePath
     * @param {string} extension
     *
     * @returns {string[]}
     */
    locate(basePath, extension) {}
}

export default getInterface(FileLocatorInterface);
