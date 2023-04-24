declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Marker telling that ack should not be done automatically for this message.
     *
     * @final
     */
    export class HandlerArgumentsStamp extends implementationOf(NonSendableStampInterface) {
        private _additionalArguments: any[];

        /**
         * Constructor.
         */
        __construct(additionalArguments: any[]): void;
        constructor(additionalArguments: any[]);

        public readonly additionalArguments: any[];
    }
}
