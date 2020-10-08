declare namespace Jymfony.Component.Cache {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
    import ItemInterface = Jymfony.Contracts.Cache.ItemInterface;
    import TimeSpanInterface = Jymfony.Contracts.DateTime.TimeSpanInterface;

    export class CacheItem<T> extends implementationOf(ItemInterface) {
        private _key?: string;
        private _value?: T;
        private _isHit: boolean;
        private _expiry?: number;
        private _defaultLifetime?: number;
        private _tags: string[];
        private _innerItem: any;
        private _pool: WeakRef<CacheItemPoolInterface>;
        private _isTaggable: boolean;

        /**
         * @inheritdoc
         */
        readonly key: string;

        /**
         * @inheritdoc
         */
        readonly isHit: boolean;

        /**
         * @inheritdoc
         */
        get(): T;

        /**
         * @inheritdoc
         */
        set(value: T): this;

        /**
         * @inheritdoc
         */
        expiresAt(expiration: null | undefined | DateTimeInterface): this;

        /**
         * @inheritdoc
         */
        expiresAfter(time: null | undefined | TimeSpanInterface | number): this;

        /**
         * Adds a tag to a cache item.
         *
         * @throws {Jymfony.Contracts.Cache.Exception.InvalidArgumentException} When tag is not valid
         */
        tag(tags: string | string[]): this;

        /**
         * Throws exception if key is invalid.
         *
         * @throws {Jymfony.Contracts.Cache.Exception.InvalidArgumentException} When key is not a valid string key.
         */
        static validateKey(key: string);
    }
}
