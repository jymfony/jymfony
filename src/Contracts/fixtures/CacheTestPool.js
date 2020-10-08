const CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
const CacheTrait = Jymfony.Contracts.Cache.CacheTrait;

/**
 * @memberOf Jymfony.Contracts.Fixtures
 */
export default class CacheTestPool extends implementationOf(CacheItemPoolInterface, CacheTrait) {
    hasItem(key) {
    }

    deleteItem(key){
    }

    deleteItems(keys = []) {
    }

    getItem(key) {
    }

    getItems(key = []) {
    }

    save(item) {
    }

    clear() {
    }

    close() {
    }
}
