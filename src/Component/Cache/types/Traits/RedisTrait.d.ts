declare namespace Jymfony.Component.Cache.Traits {
    import RedisConnectionOptions = Jymfony.Component.Cache.Adapter.RedisConnectionOptions;

    export class RedisTrait {
        public static readonly definition: Newable<RedisTrait>;
        public static readonly defaultConnectionOptions: RedisConnectionOptions;

        /**
         * @inheritdoc
         */
        close(): Promise<void>;

        /**
         * Initializes the redis adapter.
         */
        private _init(redisClient: any, namespace: string): void;

        /**
         * @inheritdoc
         */
        protected _doFetch(ids: string[]): Promise<Record<string, any>>;

        /**
         * @inheritdoc
         */
        protected _doHave(id: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        protected _doClear(namespace: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        protected _doDelete(ids: string[]): Promise<boolean>;

        /**
         * @inheritdoc
         */
        protected _doSave(values: Record<string, any>, lifetime: number): Promise<boolean>;
    }
}
