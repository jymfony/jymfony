const AbstractAdapter = Jymfony.Component.Cache.Adapter.AbstractAdapter;
const FilesystemTrait = Jymfony.Component.Cache.Traits.FilesystemTrait;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 */
class FilesystemAdapter extends mix(AbstractAdapter, FilesystemTrait) {
    __construct(namespace = '', defaultLifetime = 0, directory = undefined) {
        super.__construct(namespace, defaultLifetime);
        this._init(namespace, directory);
    }
}

module.exports = FilesystemAdapter;
