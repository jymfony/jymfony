const FileException = Jymfony.Component.HttpFoundation.File.Exception.FileException;

/**
 * Thrown when a file was not found.
 *
 * @memberOf Jymfony.Component.HttpFoundation.File.Exception
 */
export default class FileNotFoundException extends FileException {
    /**
     * Constructor.
     *
     * @param {string} path
     */
    __construct(path) {
        super.__construct(__jymfony.sprintf('The file "%s" does not exist', path));
    }
}
