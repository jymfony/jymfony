declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Stamp used to identify which bus it was passed to.
     */
    export class BusNameStamp extends implementationOf(StampInterface) {
        private _busName: string;

        /**
         * Constructor.
         */
        __construct(busName: string): void;
        constructor(busName: string);

        public readonly busName: string;
    }
}
