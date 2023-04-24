/**
 * Marker interface for exceptions to indicate that handling a message will continue to fail.
 *
 * If something goes wrong while handling a message that's received from a transport
 * and the message should not be retried, a handler can throw such an exception.
 *
 * @memberOf Jymfony.Component.Messenger.Exception
 */
class UnrecoverableExceptionInterface {
}

export default getInterface(UnrecoverableExceptionInterface);
