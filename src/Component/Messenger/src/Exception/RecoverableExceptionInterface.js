/**
 * Marker interface for exceptions to indicate that handling a message should have worked.
 *
 * If something goes wrong while handling a message that's received from a transport
 * and the message should be retried, a handler can throw such an exception.
 *
 * @memberOf Jymfony.Component.Messenger.Exception
 */
class RecoverableExceptionInterface {
}

export default getInterface(RecoverableExceptionInterface);
