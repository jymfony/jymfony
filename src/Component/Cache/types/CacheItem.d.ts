declare namespace Jymfony.Component.Cache {
    import DateTime = Jymfony.Component.DateTime.DateTime;
    import TimeSpan = Jymfony.Component.DateTime.TimeSpan;

    export class CacheItem<T> extends implementationOf(CacheItemInterface) {
        private _key?: string;
        private _value?: T;
        private _isHit: boolean;
        private _expiry?: number;
        private _defaultLifetime?: number;
        private _tags: string[];

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
        expiresAt(expiration: null|undefined|DateTime): this;

        /**
         * @inheritdoc
         */
        expiresAfter(time: null|undefined|TimeSpan|number): this;

        /**
         * Adds a tag to a cache item.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException} When tag is not valid
         */
        tag(tags: string|string[]): this;

        /**
         * Throws exception if key is invalid.
         *
         * @throws {Jymfony.Component.Cache.Exception.InvalidArgumentException} When key is not a valid string key.
         */
        static validateKey(key: string);
    }
}
