declare namespace Jymfony.Component.Cache.Traits {
    import LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;

    /**
     * @memberOf Jymfony.Component.Cache.Traits
     */
    export class ArrayTrait extends LoggerAwareTrait {
        public static readonly definition: Newable<ArrayTrait>;

        /**
         * Returns all cached values, with cache miss as null.
         */
        public readonly values: Record<string, string>;

        private _values: Record<string, string>;
        private _expiries: Record<string, number>;
        private _pruneInterval: number;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        prune(): Promise<boolean>;

        /**
         * @inheritdoc
         */
        hasItem(key: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        clear(): Promise<boolean>;

        /**
         * @inheritdoc
         */
        deleteItem(key: string): Promise<boolean>;
    }
}
