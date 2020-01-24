declare namespace Jymfony.Component.HttpServer.DependencyInjection {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * Removes empty service-locators registered for ServiceValueResolver.
     */
    export class RemoveEmptyControllerArgumentLocatorsPass extends implementationOf(CompilerPassInterface) {
        private _controllerLocator: string;

        /**
         * Constructor.
         */
        __construct(controllerLocator?: string): void;
        constructor(controllerLocator?: string);

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
