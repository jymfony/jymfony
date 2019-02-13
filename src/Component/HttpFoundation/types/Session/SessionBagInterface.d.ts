declare namespace Jymfony.Component.HttpFoundation.Session {
    /**
     * Session Bag store.
     */
    export class SessionBagInterface implements MixinInterface {
        public static readonly definition: Newable<SessionBagInterface>;

        /**
         * Gets this bag's name.
         */
        public readonly name: string;

        /**
         * Initializes the Bag.
         */
        initialize(attributes: Record<string, any>): void;

        /**
         * Gets the storage key for this bag.
         */
        public readonly storageKey: string;

        /**
         * Clears out data from bag.
         *
         * @returns {Object.<string, *>} Whatever data was contained
         */
        clear(): Record<string, any>;
    }
}
