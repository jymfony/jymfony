const InvalidArgumentException = Jymfony.Component.Messenger.Exception.InvalidArgumentException;

/**
 * Thrown when a message cannot be decoded in a serializer.
 *
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class MessageDecodingFailedException extends InvalidArgumentException {
}
