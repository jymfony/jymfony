declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    export class InlineServiceDefinitionsPass extends AbstractRecursivePass {
        private _analyzingPass: AnalyzeServiceReferencesPass;
        private _inlinedIds: Record<string, boolean>;
        private _notInlinedIds: Record<string, true>;
        private _connectedIds: Record<string, true>;
        private _cloningIds: Set<string>;
        private _graph: ServiceReferenceGraph;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(analyzingPass: AnalyzeServiceReferencesPass): void;
        constructor(analyzingPass: AnalyzeServiceReferencesPass);

        process(container: ContainerBuilder): void;

        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;

        /**
         * Checks whether a service could be inlined.
         */
        private _isInlineableDefinition(id: string, definition: Definition, graph: ServiceReferenceGraph): boolean;
    }
}
