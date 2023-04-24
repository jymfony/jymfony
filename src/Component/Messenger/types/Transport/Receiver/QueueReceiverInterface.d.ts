declare namespace Jymfony.Component.Messenger.Transport.Receiver {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Some transports may have multiple queues. This interface is used to read from only some queues.
     */
    class QueueReceiverInterface extends ReceiverInterface.definition {
        public static readonly definition: Newable<QueueReceiverInterface>;

        /**
         * Get messages from the specified queue names instead of consuming from all queues.
         */
        getFromQueues(queueNames: string[]): Promise<Envelope[]>;
    }
}
