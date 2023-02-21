declare namespace Jymfony.Component.Messenger.Transport.Receiver {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    interface ListableReceiverInterface extends ReceiverInterface {}

    /**
     * Used when a receiver has the ability to list messages and find specific messages.
     * A receiver that implements this should add the TransportMessageIdStamp
     * to the Envelopes that it returns.
     */
    export class ListableReceiverInterface {
        /**
         * Returns all the messages (up to the limit) in this receiver.
         *
         * Messages should be given the same stamps as when using ReceiverInterface.get().
         */
        all(limit?: number | null): AsyncIterator<Envelope>;

        /**
         * Returns the Envelope by id or none.
         *
         * Message should be given the same stamps as when using ReceiverInterface.get().
         */
        find(id: any): Promise<Envelope | null>;
    }
}
