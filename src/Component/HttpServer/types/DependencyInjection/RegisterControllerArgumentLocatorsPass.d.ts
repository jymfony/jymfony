declare namespace Jymfony.Component.HttpServer.DependencyInjection {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * Creates the service-locators required by ServiceValueResolver.
     */
    export class RegisterControllerArgumentLocatorsPass extends implementationOf(CompilerPassInterface) {
        private _resolverServiceId: string;
        private _controllerTag: string;
        private _controllerLocator: string;
        private _notTaggedControllerResolverServiceId: string;

        /**
         * Constructor.
         */
        __construct(resolverServiceId?: string, controllerTag?: string, controllerLocator?: string, notTaggedControllerResolverServiceId?: string): void;
        constructor(resolverServiceId?: string, controllerTag?: string, controllerLocator?: string, notTaggedControllerResolverServiceId?: string);

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
