declare namespace Jymfony.Component.Messenger.Handler {
    export class BatchHandlerInterface {
        public static readonly definition: Newable<BatchHandlerInterface>;

        /**
         * @param message
         * @param [ack = null] The function to call to ack/nack the message.
         *                     The message should be handled synchronously when null.
         *
         * @returns The number of pending messages in the batch if ack is not null,
         *          the result from handling the message otherwise
         */
        __invoke<T>(message: T, ack?: null | Acknowledger): Promise<any>;

        /**
         * Flushes any pending buffers.
         *
         * @param force Whether flushing is required; it can be skipped if not
         */
        flush(force: boolean): Promise<void>;
    }
}
