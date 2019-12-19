declare namespace Jymfony.Component.HttpServer.DependencyInjection {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * Gathers and configures the argument value resolvers.
     */
    export class ControllerArgumentValueResolverPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
        private _argumentResolverService: string;
        private _argumentValueResolverTag: string;
        private _traceableResolverStopwatch: string;

        /**
         * Constructor.
         */
        __construct(argumentResolverService?: string, argumentValueResolverTag?: string, traceableResolverStopwatch?: string): void;
        constructor(argumentResolverService?: string, argumentValueResolverTag?: string, traceableResolverStopwatch?: string);

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
