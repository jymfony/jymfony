const ControllerTrait = Jymfony.Bundle.FrameworkBundle.Controller.ControllerTrait;
const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const Inject = Jymfony.Component.DependencyInjection.Annotation.Inject;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ServiceSubscriberInterface = Jymfony.Component.DependencyInjection.ServiceSubscriberInterface;

/**
 * Provides common features needed in controllers.
 *
 * @abstract
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
export default class AbstractController extends implementationOf(ServiceSubscriberInterface, ControllerTrait) {
    _container;

    @Inject(ContainerInterface)
    set container(container) {
        this._container = container;
    }

    /**
     * Gets a container parameter by its name.
     *
     * @returns {*}
     *
     * @final
     * @protected
     */
    getParameter(name) {
        if (! this._container.has('parameter_bag')) {
            throw new ServiceNotFoundException('parameter_bag', null);
        }

        return this._container.get('parameter_bag').get(name);
    }

    /**
     * @inheritdoc
     */
    static * getSubscribedServices() {
        yield [ 'router', '?Jymfony.Component.Routing.RouterInterface' ];
        yield [ 'kernel', '?Jymfony.Component.Kernel.KernelInterface' ];
        yield [ 'security.authorization_checker', '?Jymfony.Component.Security.Authorization.AuthorizationCheckerInterface' ];
        yield [ 'templating', '?Jymfony.Component.Templating.Engine.EngineInterface' ];
        yield '?Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface';
        yield [ 'parameter_bag', '?Jymfony.Component.DependencyInjection.ParameterBag.ContainerBagInterface' ];
    }
}
