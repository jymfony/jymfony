declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class CheckCircularReferencesPass extends implementationOf(CompilerPassInterface) {
        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        private _checkOutEdges(edges: any[]);
    }
}

