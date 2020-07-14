const ExceptionInterface = Jymfony.Component.Dotenv.Exception.ExceptionInterface;

/**
 * Thrown when a file does not exist or is not readable.
 *
 * @memberOf Jymfony.Component.Dotenv.Exception
 */
export default class PathException extends mix(RuntimeException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} path
     * @param {int} code
     * @param {Error} previous
     */
    __construct(path, code = 0, previous = null) {
        super.__construct(__jymfony.sprintf('Unable to read the "%s" environment file.', path), code, previous);
    }
}
