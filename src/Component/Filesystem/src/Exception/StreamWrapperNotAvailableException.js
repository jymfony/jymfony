const ExceptionInterface = Jymfony.Component.Filesystem.Exception.ExceptionInterface;

/**
 * Thrown when a non-registered protocol has been requested
 * to the stream wrapper registry.
 *
 * @memberOf Jymfony.Component.Filesystem.Exception
 */
class StreamWrapperNotAvailableException extends mix(RuntimeException, ExceptionInterface) {
    __construct(protocol, previous = undefined) {
        super.__construct(
            __jymfony.sprintf('Cannot find a stream wrapper for protocol "%s".', protocol),
            null,
            previous
        );
    }
}

module.exports = StreamWrapperNotAvailableException;
