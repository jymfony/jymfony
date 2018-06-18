/**
 * @memberOf Jymfony.Component.Config
 */
class FileLocatorInterface {
    /**
     * Returns a full path for a given file name.
     *
     * @param {string} name The file name to locate
     * @param {undefined|string} currentPath The current path
     * @param {boolean} first Whether to return the first occurrence or an array of filenames
     *
     * @returns {string[]|string} The full path to the file or an array of file paths
     *
     * @throws {InvalidArgumentException} If name is empty
     * @throws {Jymfony.Component.Config.Exception.FileLocatorFileNotFoundException} If a file is not found
     */
    locate(name, currentPath = undefined, first = true) { }
}

module.exports = getInterface(FileLocatorInterface);
