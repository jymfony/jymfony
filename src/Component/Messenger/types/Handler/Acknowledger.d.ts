declare namespace Jymfony.Component.Messenger.Handler {
    export class Acknowledger {
        private _handlerClass: string;
        private _ack: (e?: Error | null, result?: any) => Promise<void>;
        private _error: Error | null;
        private _result: any;

        /**
         * Constructor.
         */
        __construct(handlerClass: string, ack?: null | ((e?: Error | null, result?: any) => Promise<void>)): void;
        constructor(handlerClass: string, ack?: null | ((e?: Error | null, result?: any) => Promise<void>));

        /**
         * @param {*} [result = null]
         *
         * @returns {Promise<void>}
         */
        ack(result?: any): Promise<void>;

        nack(error: Error): Promise<void>;

        public readonly error: Error | null;

        public readonly result: any;

        public readonly isAcknowledged: boolean;

        private _doAck(e?: Error | null, result?: any): Promise<void>;
    }
}
