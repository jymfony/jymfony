/**
 * @memberOf Jymfony.Component.Messenger.Handler
 */
class BatchHandlerInterface {
    /**
     * @param {Object} message
     * @param {Jymfony.Component.Messenger.Handler.Acknowledger | null} [ack = null]
     *      The function to call to ack/nack the message.
     *      The message should be handled synchronously when null.
     *
     * @returns {Promise<*>} The number of pending messages in the batch if ack is not null,
     *                       the result from handling the message otherwise
     */
    async __invoke(message, ack = null) { }

    /**
     * Flushes any pending buffers.
     *
     * @param {boolean} force Whether flushing is required; it can be skipped if not
     */
    async flush(force) { }
}

export default getInterface(BatchHandlerInterface);
