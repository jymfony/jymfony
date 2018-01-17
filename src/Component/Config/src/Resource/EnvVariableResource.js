const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
class EnvVariableResource extends implementationOf(SelfCheckingResourceInterface) {
    __construct(name) {
        this._resource = process.env[name];
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
    isFresh(/* timestamp */) {
        return this._resource === process.env[name];
    }
}

module.exports = EnvVariableResource;
