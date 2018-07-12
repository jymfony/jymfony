const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
class ClassExistenceResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * Constructor.
     *
     * @param {*} resource
     */
    __construct(resource) {
        this._resource = resource;
        this._exists = ReflectionClass.exists(resource);
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this._resource;
    }

    /**
     * @inheritdoc
     */
    isFresh(/* timestamp */) {
        return this._exists === ReflectionClass.exists(this._resource);
    }
}

module.exports = ClassExistenceResource;
