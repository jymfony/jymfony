declare namespace Jymfony.Component.HttpFoundation.Session.Storage {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import SessionBagInterface = Jymfony.Component.HttpFoundation.Session.SessionBagInterface;

    /**
     * Cache storage backend for session.
     */
    export class CacheSessionStorage extends implementationOf(SessionStorageInterface) {
        /**
         * @inheritdoc
         */
        public readonly started: boolean;

        /**
         * @inheritdoc
         */
        public id: string | undefined;

        /**
         * @inheritdoc
         */
        public name: string;

        private _cache: CacheItemPoolInterface<any>;

        private _lifetime: number;

        private _started: boolean;

        /**
         * Session bags.
         */
        private _bags: Record<string, SessionBagInterface>;

        /**
         * Session ID.
         */
        private _id?: string;

        /**
         * Session name.
         */
        private _name: string;

        /**
         * Constructor.
         */
        __construct(cache: CacheItemPoolInterface<any>, lifetime?: number): void;

        /**
         * @inheritdoc
         */
        start(): Promise<void>;

        /**
         * @inheritdoc
         */
        regenerate(destroy?: boolean, lifetime?: number): Promise<void>;

        /**
         * @inheritdoc
         */
        save(): Promise<void>;

        /**
         * @inheritdoc
         */
        clear(): Promise<void>;

        /**
         * @inheritdoc
         */
        getBag(name: string): SessionBagInterface;

        /**
         * @inheritdoc
         */
        registerBag(bag: SessionBagInterface): void;

        /**
         * Loads the session attributes.
         */
        private _loadSession(): Promise<void>;

        /**
         * Generates a new session ID.
         */
        private _generateId(): Promise<string>;

        /**
         * Destroy the session data.
         */
        private _destroy(): Promise<void>;
    }
}
