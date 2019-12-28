const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const TraceableValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.TraceableValueResolver;

/**
 * Gathers and configures the argument value resolvers.
 *
 * @memberOf Jymfony.Component.HttpServer.DependencyInjection
 */
export default class ControllerArgumentValueResolverPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
    /**
     * Constructor.
     *
     * @param {string} argumentResolverService
     * @param {string} argumentValueResolverTag
     * @param {string} traceableResolverStopwatch
     */
    __construct(argumentResolverService = 'argument_resolver', argumentValueResolverTag = 'controller.argument_value_resolver', traceableResolverStopwatch = 'debug.stopwatch') {
        this._argumentResolverService = argumentResolverService;
        this._argumentValueResolverTag = argumentValueResolverTag;
        this._traceableResolverStopwatch = traceableResolverStopwatch;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition(this._argumentResolverService)) {
            return;
        }

        const resolvers = [ ...this.findAndSortTaggedServices(this._argumentValueResolverTag, container) ];

        if (container.getParameter('kernel.debug') &&
            ReflectionClass.exists('Jymfony.Component.Stopwatch.Stopwatch') &&
            container.has(this._traceableResolverStopwatch)) {
            for (const resolverReference of resolvers) {
                const id = resolverReference.toString();
                container.register('debug.'+id, TraceableValueResolver)
                    .setDecoratedService(id)
                    .setArguments([ new Reference('debug.' + id + '.inner'), new Reference(this._traceableResolverStopwatch) ]);
            }
        }

        container
            .getDefinition(this._argumentResolverService)
            .replaceArgument(1, new IteratorArgument(resolvers))
        ;
    }
}
