declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Stamp used to override the transport names specified in the Messenger routing configuration file.
     *
     * @final
     */
    export class TransportNamesStamp extends implementationOf(StampInterface) {
        private _transportNames: string[];

        /**
         * Constructor.
         *
         * @param transportNames Transport names to be used for the message
         */
        __construct(transportNames: string[] | string): void;
        constructor(transportNames: string[] | string);

        public readonly transportNames: string[];
    }
}
