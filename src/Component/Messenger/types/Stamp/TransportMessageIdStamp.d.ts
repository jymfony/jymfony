declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Added by a sender or receiver to indicate the id of this message in that transport.
     *
     * @final
     */
    export class TransportMessageIdStamp<T extends any> extends implementationOf(StampInterface) {
        private _id: T;

        /**
         * Constructor.
         *
         * @param id some "identifier" of the message in a transport
         */
        __construct(id: T): void;
        constructor(id: T);

        public readonly id: T;
    }
}
