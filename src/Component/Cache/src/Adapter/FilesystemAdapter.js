const AbstractAdapter = Jymfony.Component.Cache.Adapter.AbstractAdapter;

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 */
class FilesystemAdapter extends mix(AbstractAdapter) {
    __construct(namespace = '', defaultLifetime = 0, directory = undefined) {
        super.__construct(namespace, defaultLifetime);
        this._init(namespace, directory);
    }
}

module.exports = FilesystemAdapter;
