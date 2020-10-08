declare namespace Jymfony.Component.Kernel.CacheClearer {
    export class CacheClearerInterface {
        /**
         * Clears any caches necessary
         *
         * @param {string} cacheDir
         */
        clear(cacheDir: string): void;
    }
}
