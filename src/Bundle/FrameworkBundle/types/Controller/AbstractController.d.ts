declare namespace Jymfony.Bundle.FrameworkBundle.Controller {
    import ServiceSubscriberInterface = Jymfony.Component.DependencyInjection.ServiceSubscriberInterface;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

    /**
     * Provides common features needed in controllers.
     *
     * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
     */
    export abstract class AbstractController extends implementationOf(ServiceSubscriberInterface, ControllerTrait) {
        public /* writeonly */ container: ContainerInterface;
        protected _container: ContainerInterface;

        /**
         * Gets a container parameter by its name.
         *
         * @final
         */
        protected getParameter(name: string): any;

        /**
         * @inheritdoc
         */
        static getSubscribedServices(): IterableIterator<string|string[]>;
    }
}
