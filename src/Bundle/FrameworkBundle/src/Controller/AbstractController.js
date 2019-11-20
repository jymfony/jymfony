import { @Inject } from '@jymfony/decorators';

const ControllerTrait = Jymfony.Bundle.FrameworkBundle.Controller.ControllerTrait;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
const ServiceSubscriberInterface = Jymfony.Component.DependencyInjection.ServiceSubscriberInterface;

/**
 * Provides common features needed in controllers.
 *
 * @abstract
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
export default class AbstractController extends implementationOf(ServiceSubscriberInterface, ControllerTrait) {
    @Inject(ContainerInterface)
    container;

    /**
     * Gets a container parameter by its name.
     *
     * @returns {*}
     *
     * @final
     * @protected
     */
    getParameter(name) {
        if (! this.container.has('parameter_bag')) {
            throw new ServiceNotFoundException('parameter_bag', null);
        }

        return this.container.get('parameter_bag').get(name);
    }

    /**
     * @inheritdoc
     */
    static * getSubscribedServices() {
        yield ['router', '?Jymfony.Component.Routing.RouterInterface'];
        yield ['kernel', '?Jymfony.Component.Kernel.KernelInterface'];
        yield ['security.authorization_checker', '?Jymfony.Component.Security.Authorization.AuthorizationCheckerInterface'];
        yield ['templating', '?Jymfony.Component.Templating.Engine.EngineInterface'];
        yield ['Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface'];
        yield ['parameter_bag', '?Jymfony.Component.DependencyInjection.ParameterBag.ContainerBagInterface'];
    }
}
