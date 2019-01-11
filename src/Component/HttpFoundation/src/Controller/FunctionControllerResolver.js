const ControllerResolverInterface = Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface;
const NullLogger = Jymfony.Component.Logger.NullLogger;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Controller
 */
class FunctionControllerResolver extends implementationOf(ControllerResolverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger]
     */
    __construct(logger = undefined) {
        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();
    }

    /**
     * @inheritdoc
     */
    getController(request) {
        let controller = request.attributes.get('_controller');
        if (! controller) {
            this._logger.warning('Unable to look for the controller as the "_controller" paramter is missing.');

            return false;
        }

        if (isCallableArray(controller)) {
            controller = getCallableFromArray(controller);
        }

        if (undefined === controller || ! isFunction(controller)) {
            throw new LogicException(__jymfony.sprintf(
                'Controller "%s" is not a valid controller.',
                isObject(controller) ? ReflectionClass.getClassName(controller) : typeof controller,
            ));
        }

        return controller;
    }
}

module.exports = FunctionControllerResolver;
