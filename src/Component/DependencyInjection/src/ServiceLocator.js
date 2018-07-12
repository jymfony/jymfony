const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ServiceLocator extends implementationOf(ContainerInterface) {
    /**
     * Constructor.
     *
     * @param {Object<string, Function>} factories
     */
    __construct(factories) {
        /**
         * @type {Object<string, Function>}
         *
         * @private
         */
        this._factories = factories;

        /**
         * @type {Object<string, boolean>}
         *
         * @private
         */
        this._loading = {};
    }

    /**
     * @inheritdoc
     */
    has(id) {
        return undefined !== this._factories[id];
    }

    /**
     * @inheritdoc
     */
    get(id) {
        if (undefined === this._factories[id]) {
            throw new ServiceNotFoundException(id);
        }

        if (this._loading[id]) {
            throw new ServiceCircularReferenceException(id, Object.keys(this._loading));
        }

        this._loading[id] = true;
        try {
            return this._factories[id]();
        } finally {
            delete this._loading[id];
        }
    }

    __invoke(id) {
        return this.has(id) ? this.get(id) : undefined;
    }
}

module.exports = ServiceLocator;
