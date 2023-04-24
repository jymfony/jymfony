declare namespace Jymfony.Component.Messenger.DependencyInjection {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class MessengerPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        private _registerHandlers(container: ContainerBuilder, busIds: string[]): void;

        private _guessHandledClasses(handlerClass: ReflectionClass, serviceId: string): string[];

        private _registerReceivers(container: ContainerBuilder, busIds: string[]): void

        private _registerBusToCollector(container: ContainerBuilder, busId: string): void;

        private _registerBusMiddleware(container: ContainerBuilder, busId: string, middlewareCollection: any[]): void;

        private _getServiceClass(container: ContainerBuilder, serviceId: string): string;
    }
}
