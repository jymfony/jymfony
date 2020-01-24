const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
export default class ServiceLocator extends implementationOf(ContainerInterface) {
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

        /**
         * @type {string}
         *
         * @private
         */
        this._externalId = undefined;

        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @private
         */
        this._container = undefined;
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
        id = Container.normalizeId(id);

        if (undefined === this._factories[id]) {
            throw this._createNotFoundException(id);
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

    /**
     * Sets the service locator context.
     *
     * @param {string} externalId
     * @param {Jymfony.Component.DependencyInjection.Container} container
     *
     * @internal
     */
    _withContext(externalId, container) {
        const locator = new __self(this._factories);

        locator._externalId = externalId;
        locator._container = container;

        return locator;
    }

    /**
     * Creates a not found exception.
     *
     * @param {string} id
     *
     * @returns {Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException}
     *
     * @private
     */
    _createNotFoundException(id) {
        const exception = new ServiceNotFoundException(id, Object.values(this._loading).pop());
        if (0 < Object.keys(this._loading).length) {
            return exception;
        }

        const msg = [];
        msg.push(__jymfony.sprintf('Service "%s" not found:', id));

        if (this._container && this._container.has(id)) {
            msg.push('even though it exists in app\'s container,');
        }

        if (this._externalId) {
            msg.push(__jymfony.sprintf('the container inside "%s" is a smaller service locator that %s', this._externalId, this._formatAlternatives()));
        } else {
            msg.push(__jymfony.sprintf('the current service locator %s', this._formatAlternatives()));
        }

        msg.push('Unless you need extra laziness, try using dependency injection instead, otherwise, you need to declare it using getSubscribedServices()');
        exception.message = msg.join(' ');

        return exception;
    }

    /**
     * Formats alternatives for this service locator.
     *
     * @returns {string}
     *
     * @private
     */
    _formatAlternatives(separator = 'and') {
        let format = '"%s"%s';

        const alternatives = Object.keys(this._factories);
        if (0 === alternatives.length) {
            return 'is empty...';
        }

        format = __jymfony.sprintf('only knows about the %s service%s.', format, 1 < alternatives.length ? 's' : '');
        const last = alternatives.pop();

        return __jymfony.sprintf(format, alternatives ? alternatives.join('", "') : last, alternatives ? __jymfony.sprintf(' %s "%s"', separator, last) : '');
    }
}
