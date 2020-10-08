declare namespace Jymfony.Component.HttpFoundation.Controller {
    import Container = Jymfony.Component.DependencyInjection.Container;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;

    export class ContainerControllerResolver extends implementationOf(ControllerResolverInterface) {
        private _container: Container;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(container: Container, logger?: LoggerInterface): void;
        constructor(container: Container, logger?: LoggerInterface);

        /**
         * @inheritdoc
         */
        getController(request: Request): Invokable<any> | false;
    }
}
