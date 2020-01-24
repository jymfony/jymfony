const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * Yields a service keyed by _controller and argument name.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class ServiceValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} container
     */
    __construct(container) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._container = container;
    }

    /**
     * @inheritdoc
     */
    supports(request, argument) {
        let controller = request.attributes.get('_controller');

        if (isCallableArray(controller)) {
            controller = ReflectionClass.getClassName(controller[0]) + ':' + controller[1];
        } else if (! isString(controller) || '' === controller) {
            return false;
        }

        const i = controller.lastIndexOf(':');
        if (! this._container.has(controller) && -1 !== i) {
            controller = controller.substr(0, i) + controller.substr(i).toLowerCase();
        }

        return this._container.has(controller) && this._container.get(controller).has(argument.name);
    }

    /**
     * @inheritdoc
     */
    * resolve(request, argument) {
        let controller = request.attributes.get('_controller');

        if (isCallableArray(controller)) {
            controller = ReflectionClass.getClassName(controller[0]) + ':' + controller[1];
        }

        if (! this._container.has(controller)) {
            const i = controller.lastIndexOf(':');
            controller = controller.substr(0, i) + controller.substr(i).toLowerCase();
        }

        try {
            yield this._container.get(controller).get(argument.name);
        } catch (e) {
            const what = __jymfony.sprintf('argument %s of "%s()"', argument.name, controller);
            let message = e.message.replace(/service "\.service_locator\.[^"]+"/g, what);

            if (e.message === message) {
                message = __jymfony.sprintf('Cannot resolve %s: %s', what, message);
            }

            e.message = message;

            throw e;
        }
    }
}
