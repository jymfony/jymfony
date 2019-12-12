declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    export class AnalyzeServiceReferencesPass extends AbstractRecursivePass {
        protected _container?: ContainerBuilder;
        protected _currentDefinition?: Definition;

        private _onlyConstructorArguments: boolean;
        private _graph?: ServiceReferenceGraph;
        private _lazy: boolean;

        /**
         * Constructor.
         */
        __construct(onlyConstructorArguments?: boolean): void;

        process(container: ContainerBuilder): void;

        protected _processValue(value: any, isRoot?: boolean): any;

        private _getDefinition(id: string|symbol|Newable<any>): Definition|undefined;

        private _getDefinitionId(id: string|symbol|Newable<any>);
    }
}
