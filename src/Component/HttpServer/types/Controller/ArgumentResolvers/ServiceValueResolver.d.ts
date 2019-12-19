declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

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
