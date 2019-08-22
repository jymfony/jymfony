const FileLoaderLoadException = Jymfony.Component.Config.Exception.FileLoaderLoadException;

/**
 * Exception class for when a circular reference is detected when importing resources.
 *
 * @memberOf Jymfony.Component.Config.Exception
 */
export default class FileLoaderImportCircularReferenceException extends FileLoaderLoadException {
    /**
     * Constructor.
     *
     * @param {*[]} resources
     * @param {null|int} [code = null]
     * @param {Exception} [previous]
     */
    __construct(resources, code = null, previous = undefined) {
        const message = __jymfony.sprintf('Circular reference detected in "%s" ("%s" > "%s").', FileLoaderLoadException.varToString(resources[0]), resources.join('" > "'), resources[0]);

        super.__construct('', undefined, code, previous, undefined);
        this.message = message;
    }
}
