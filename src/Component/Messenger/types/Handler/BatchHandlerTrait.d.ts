declare namespace Jymfony.Component.Messenger.Handler {
    import Acknowledger = Jymfony.Component.Messenger.Handler.Acknowledger;

    export abstract class BatchHandlerTrait {
        private _jobs: [object, Acknowledger][];

        /**
         * @inheritdoc
         */
        flush(): Promise<void>;

        /**
         * @param {object} message
         * @param {Jymfony.Component.Messenger.Handler.Acknowledger|null} ack
         *              The function to call to ack/nack the message.
         *              The message should be handled synchronously when null.
         *
         * @returns {*} The number of pending messages in the batch if $ack is not null,
         *              the result from handling the message otherwise
         */
        private _handle(message: object, ack?: Acknowledger | null): Promise<number>;

        private _shouldFlush(): boolean;

        /**
         * Completes the jobs in the list.
         *
         * @param jobs A list of pairs of messages and their corresponding acknowledgers
         */
        protected abstract _process(jobs: [object, Acknowledger][]): Promise<void>;
    }
}
