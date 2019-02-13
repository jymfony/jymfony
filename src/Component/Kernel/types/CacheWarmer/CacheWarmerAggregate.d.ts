declare namespace Jymfony.Component.Kernel.CacheWarmer {
    /**
     * Aggregates several cache warmers into a single one.
     */
    export class CacheWarmerAggregate extends implementationOf(CacheWarmerInterface) {
        private _warmers: CacheWarmerInterface[];
        private _optionalsEnabled: boolean;

        /**
         * Constructor.
         */
        __construct(warmers?: CacheWarmerInterface[]): void;
        constructor(warmers?: CacheWarmerInterface[]);

        /**
         * Enables optional cache warmers.
         */
        enableOptionalWarmers(): void;

        /**
         * @inheritdoc
         */
        warmUp(cacheDir: string): Promise<void>;

        /**
         * @inheritdoc
         */
        public readonly optional: false;

        public /* writeonly */ warmers: CacheWarmerInterface[];

        /**
         * Adds a cache warmer.
         */
        add(warmer: CacheWarmerInterface): void;
    }
}
