declare namespace Jymfony.Component.Messenger.Transport.Sender {
    export class SenderInterface {
        public static readonly definition: Newable<SenderInterface>;

        /**
         * Sends the given envelope.
         *
         * The sender can read different stamps for transport configuration,
         * like delivery delay.
         *
         * If applicable, the returned Envelope should contain a TransportMessageIdStamp.
         */
        send<T extends object = object>(envelope: Envelope<T>): Promise<Envelope<T>>;
    }
}
