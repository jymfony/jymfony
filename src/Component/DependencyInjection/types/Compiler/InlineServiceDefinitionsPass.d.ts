declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    export class InlineServiceDefinitionsPass extends mix(AbstractRecursivePass, RepeatablePassInterface) {
        public readonly inlinedServiceIds: Record<string, string[]>;

        private _inlinedServiceIds: Record<string, string[]>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        setRepeatedPass(pass: RepeatedPass): void;

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
