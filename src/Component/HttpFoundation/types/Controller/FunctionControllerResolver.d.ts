declare namespace Jymfony.Component.HttpFoundation.Controller {
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;

    export class FunctionControllerResolver extends implementationOf(ControllerResolverInterface) {
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(logger?: LoggerInterface): void;
        constructor(logger?: LoggerInterface);

        /**
         * @inheritdoc
         */
        getController(request: Request): Invokable<any> | false;
    }
}
