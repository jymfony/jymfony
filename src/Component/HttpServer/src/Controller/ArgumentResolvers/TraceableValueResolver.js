const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * Provides timing information via the stopwatch.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class TraceableValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @type {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface}
     *
     * @private
     */
    _inner;

    /**
     * @type {Jymfony.Contracts.Stopwatch.StopwatchInterface}
     *
     * @private
     */
    _stopwatch;

    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface} inner
     * @param {Jymfony.Contracts.Stopwatch.StopwatchInterface} stopwatch
     */
    __construct(inner, stopwatch) {
        this._inner = inner;
        this._stopwatch = stopwatch;
    }

    /**
     * @inheritdoc
     */
    async supports(request, argument) {
        const method = ReflectionClass.getClassName(this._inner) + '.supports';
        this._stopwatch.start(method, 'controller.argument_value_resolver');

        try {
            return await this._inner.supports(request, argument);
        } finally {
            this._stopwatch.stop(method);
        }
    }

    /**
     * @inheritdoc
     */
    async resolve(request, argument) {
        const method = ReflectionClass.getClassName(this._inner) + '.resolve';
        this._stopwatch.start(method, 'controller.argument_value_resolver');

        const values = [];
        await __jymfony.forAwait(this._inner.resolve(request, argument), value => values.push(value));

        this._stopwatch.stop(method);

        return values;
    }
}
