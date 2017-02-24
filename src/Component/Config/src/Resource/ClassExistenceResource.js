const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

module.exports = class ClassExistenceResource extends implementationOf(SelfCheckingResourceInterface) {
    constructor(resource) {
        super();

        this._resource = resource;
        this._exists = ReflectionClass.exists(resource);
    }

    /**
     * {@inheritDoc}
     */
    toString() {
        return this._resource;
    }

    /**
     * {@inheritDoc}
     */
    isFresh(timestamp) {
        return this._exists === ReflectionClass.exists(this._resource);
    }
};
