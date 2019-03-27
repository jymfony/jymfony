declare namespace Jymfony.Component.Kernel.CacheClearer {
    export class ChainCacheClearer extends implementationOf(CacheClearerInterface) {
        private _clearers: CacheClearerInterface[];

        /**
         * Constructor.
         */
        __construct(clearers?: CacheClearerInterface[]): void;
        constructor(clearers?: CacheClearerInterface[]);

        /**
         * @inheritdoc
         */
        clear(cacheDir: string): void;

        add(clearer: CacheClearerInterface): void;
    }
}
