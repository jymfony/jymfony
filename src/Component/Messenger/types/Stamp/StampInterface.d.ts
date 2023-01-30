declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * An envelope stamp related to a message.
     *
     * Stamps must be serializable value objects for transport.
     */
    export class StampInterface {
        public static readonly definition: Newable<StampInterface>;
    }
}
