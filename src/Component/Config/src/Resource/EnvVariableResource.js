const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class EnvVariableResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * Constructor.
     *
     * @param {string} name
     */
    __construct(name) {
        this._resource = process.env[name];
        this._name = name;
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
        return this._resource === process.env[this._name];
    }
}
