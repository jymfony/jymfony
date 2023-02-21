declare namespace Jymfony.Component.Messenger.Transport {
    export class SetupableTransportInterface {
        public static readonly definition: Newable<SetupableTransportInterface>;

        /**
         * Set up the transport.
         */
        setup(): Promise<void>;
    }
}
