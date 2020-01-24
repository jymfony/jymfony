const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const CacheSessionStorage = Jymfony.Component.HttpFoundation.Session.Storage.CacheSessionStorage;

/**
 * In memory storage backend for session.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session.Storage
 */
export default class MockArraySessionStorage extends CacheSessionStorage {
    /**
     * Constructor.
     *
     * @param {int} [lifetime = 0]
     */
    __construct(lifetime = 0) {
        super.__construct(new ArrayAdapter(), lifetime);
    }
}
