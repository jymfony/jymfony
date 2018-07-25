const ExceptionInterface = Jymfony.Component.Filesystem.Exception.ExceptionInterface;

/**
 * Thrown when an unsupported operation has been called on a
 * stream wrapper (ex: readdir on http).
 *
 * @memberOf Jymfony.Component.Filesystem.Exception
 */
class UnsupportedOperationException extends mix(RuntimeException, ExceptionInterface) {
}

module.exports = UnsupportedOperationException;
