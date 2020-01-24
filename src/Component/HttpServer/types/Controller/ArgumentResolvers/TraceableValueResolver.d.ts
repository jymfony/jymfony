declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

    /**
     * Provides timing information via the stopwatch.
     *
     * @final
     * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
     */
    export class TraceableValueResolver extends implementationOf(ArgumentValueResolverInterface) {
        private _inner: ArgumentValueResolverInterface;
        private _stopwatch: StopwatchInterface;

        /**
         * Constructor.
         */
        __construct(inner: ArgumentValueResolverInterface, stopwatch: StopwatchInterface): void;
        constructor(inner: ArgumentValueResolverInterface, stopwatch: StopwatchInterface);

        /**
         * @inheritdoc
         */
        supports(request: RequestInterface, argument: ReflectionParameter): boolean;

        /**
         * @inheritdoc
         */
        resolve(request: RequestInterface, argument: ReflectionParameter): AsyncIterator<any>;
    }
}
