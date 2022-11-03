const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * Provides an intuitive error message when controller fails because it is not registered as a service.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class NotTaggedControllerValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} container
     */
    __construct(container) {
        this._container = container;
    }

    /**
     * @inheritdoc
     */
    supports(request) {
        let controller = request.attributes.get('_controller');

        if (isCallableArray(controller) && isString(controller[0])) {
            controller = ReflectionClass.getClassName(controller[0]) + ':' + controller[1];
        } else if (! isString(controller) || '' === controller) {
            return false;
        }

        const i = controller.lastIndexOf(':');
        if (! this._container.has(controller) && -1 !== i) {
            controller = controller.substr(0, i) + controller.substr(i).toLowerCase();
        }

        return false === this._container.has(controller);
    }

    /**
     * @inheritdoc
     */
    resolve(request, argument) {
        let controller = request.attributes.get('_controller');
        if (isCallableArray(controller)) {
            controller = ReflectionClass.getClassName(controller[0]) + ':' + controller[1];
        }

        if (! this._container.has(controller)) {
            const i = controller.lastIndexOf(':');
            controller = controller.substring(0, i) + controller.substr(i).toLowerCase();
        }

        const what = __jymfony.sprintf('argument %s of "%s()"', argument.name, controller);
        const message = __jymfony.sprintf('Could not resolve %s, maybe you forgot to register the controller as a service or missed tagging it with the "controller.service_arguments"?', what);

        throw new RuntimeException(message);
    }
}
