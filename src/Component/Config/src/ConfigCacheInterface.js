/**
 * @memberOf Jymfony.Component.Config
 */
class ConfigCacheInterface {
    /**
     * Gets the cache file fs.
     *
     * @returns {string} The cache file fs
     */
    getPath() { }

    /**
     * Checks if the cache is still fresh.
     * This check should take the metadata passed to the write() method into consideration.
     *
     * @returns {boolean} Whether the cache is still fresh
     */
    isFresh() { }

    /**
     * Writes the given content into the cache file. Metadata will be stored
     * independently and can be used to check cache freshness at a later time.
     *
     * @param {string} content The content to write into the cache
     * @param {Jymfony.Component.Config.Resource.ResourceInterface[]} metadata An array of ResourceInterface instances
     *
     * @throws {RuntimeException} When the cache file cannot be written
     */
    write(content, metadata = undefined) { }
}

module.exports = getInterface(ConfigCacheInterface);
