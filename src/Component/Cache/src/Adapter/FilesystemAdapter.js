const AbstractAdapter = Jymfony.Component.Cache.Adapter.AbstractAdapter;
const FilesystemTrait = Jymfony.Component.Cache.Traits.FilesystemTrait;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 */
export default class FilesystemAdapter extends mix(AbstractAdapter, FilesystemTrait) {
    /**
     * Constructor.
     *
     * @param {string} [namespace = '']
     * @param {int} [defaultLifetime = 0]
     * @param {string} [directory]
     */
    __construct(namespace = '', defaultLifetime = 0, directory = undefined) {
        super.__construct(namespace, defaultLifetime);
        this._init(namespace, directory);
    }
}
