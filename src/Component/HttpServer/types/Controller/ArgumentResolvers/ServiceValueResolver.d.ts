declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Yields a service keyed by _controller and argument name.
     *
     * @final
     */
    export class ServiceValueResolver extends implementationOf(ArgumentValueResolverInterface) {
        private _container: ContainerInterface;

        /**
         * Constructor.
         */
        __construct(container: ContainerInterface): void;
        constructor(container: ContainerInterface);

        /**
         * @inheritdoc
         */
        supports(request: RequestInterface, argument: ReflectionParameter): boolean;

        /**
         * @inheritdoc
         */
        resolve(request: RequestInterface, argument: ReflectionParameter): Iterator<any>;
    }
}
