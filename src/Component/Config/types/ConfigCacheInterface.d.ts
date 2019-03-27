declare namespace Jymfony.Component.Config {
    import ResourceInterface = Jymfony.Component.Config.Resource.ResourceInterface;

    export class ConfigCacheInterface implements MixinInterface {
        public static readonly definition: Newable<ConfigCacheInterface>;

        /**
         * Gets the cache file fs.
         *
         * @returns The cache file fs
         */
        getPath(): string;

        /**
         * Checks if the cache is still fresh.
         * This check should take the metadata passed to the write() method into consideration.
         *
         * @returns Whether the cache is still fresh
         */
        isFresh(): boolean;

        /**
         * Writes the given content into the cache file. Metadata will be stored
         * independently and can be used to check cache freshness at a later time.
         *
         * @param content The content to write into the cache
         * @param metadata An array of ResourceInterface instances
         *
         * @throws {RuntimeException} When the cache file cannot be written
         */
        write(content: string, metadata: ResourceInterface[]|undefined): void;
    }
}
