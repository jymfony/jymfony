declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Marker telling that any batch handlers bound to the envelope should be flushed.
     *
     * @final
     */
    export class FlushBatchHandlersStamp extends implementationOf(NonSendableStampInterface) {
        private _force: boolean;

        /**
         * Constructor.
         */
        __construct(force: boolean): void;
        constructor(force: boolean);

        public readonly force: boolean;
    }
}
