const CacheSessionStorage = Jymfony.Component.HttpFoundation.Session.Storage.CacheSessionStorage;
const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Session.Storage
 *
 * @internal
 * @final
 */
export default class FilesystemSessionStorage extends CacheSessionStorage {
    /**
     * Constructor.
     *
     * @param {Object.<string, *>} options
     */
    __construct(options) {
        super.__construct(new FilesystemAdapter('', options.max_lifetime, options.save_path), options.max_lifetime);

        this.name = options.name;
    }
}
