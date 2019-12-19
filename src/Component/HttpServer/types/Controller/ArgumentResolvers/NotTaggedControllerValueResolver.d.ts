declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Provides an intuitive error message when controller fails because it is not registered as a service.
     *
     * @final
     */
    export class NotTaggedControllerValueResolver extends implementationOf(ArgumentValueResolverInterface) {
        private _container: ContainerInterface;

        /**
         * Constructor.
         */
        __construct(container: ContainerInterface): void;
        constructor(container: ContainerInterface);

        /**
         * @inheritdoc
         */
        supports(request: RequestInterface): boolean;

        /**
         * @inheritdoc
         */
        resolve(request: RequestInterface, argument: ReflectionParameter): never;
    }
}
