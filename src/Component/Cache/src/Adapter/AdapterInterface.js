const CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;

/**
 * Interface for adapters managing instances of Symfony's CacheItem.
 *
 * @memberOf Jymfony.Component.Cache.Adapter
 */
class AdapterInterface extends CacheItemPoolInterface.definition {
    /**
     * @inheritdoc
     */
    getItem(key) { }

    /**
     * @inheritdoc
     */
    getItems(keys = []) { }

    /**
     * @inheritdoc
     */
    clear(prefix = '') { }
}

export default getInterface(AdapterInterface);
