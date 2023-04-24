const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;

/**
 * Some transports may have multiple queues. This interface is used to read from only some queues.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.Receiver
 */
class QueueReceiverInterface extends ReceiverInterface.definition {
    /**
     * Get messages from the specified queue names instead of consuming from all queues.
     *
     * @param {string[]} queueNames
     *
     * @returns {Promise<Jymfony.Component.Messenger.Envelope[]>}
     */
    async getFromQueues(queueNames) { }
}

export default getInterface(QueueReceiverInterface);
