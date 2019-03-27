declare namespace Jymfony.Component.Kernel.CacheClearer {
    export class CacheClearerInterface implements MixinInterface {
        /**
         * Clears any caches necessary
         *
         * @param {string} cacheDir
         */
        clear(cacheDir: string): void;
    }
}
