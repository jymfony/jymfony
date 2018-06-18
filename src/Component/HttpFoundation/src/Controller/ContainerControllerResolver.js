const ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
const NullLogger = Jymfony.Component.Logger.NullLogger;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Controller
 */
class ContainerControllerResolver extends implementationOf(ControllerResolverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger = new Jymfony.Component.Logger.NullLogger()]
     */
    __construct(container, logger = new NullLogger()) {
        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @private
         */
        this._container = container;

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger;
    }

    /**
     * @inheritdoc
     */
    getController(request) {
        let controller = request.attributes.get('_controller');
        let method;
        if (! controller) {
            this._logger.warning('Unable to look for the controller as the "_controller" paramter is missing.');

            return false;
        }

        if (isCallableArray(controller)) {
            controller = getCallableFromArray(controller);
        }

        if (isFunction(controller)) {
            return controller;
        }

        if (isString(controller) && -1 !== controller.indexOf(':')) {
            [ controller, method ] = controller.split(':', 2);
        }

        if (! this._container.has(controller)) {
            throw new LogicException(__jymfony.sprintf('Controller not found: service "%s" does not exist.', controller));
        }

        const service = this._container.get(controller);
        if (undefined === method || ! isFunction(service[method])) {
            throw new LogicException(__jymfony.sprintf('Controller "%s" cannot be called with method "%s".', controller, method));
        }

        return getCallableFromArray([ service, method ]);
    }
}

module.exports = ContainerControllerResolver;
