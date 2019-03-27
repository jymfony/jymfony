declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ResolveInvalidReferencesPass extends implementationOf(CompilerPassInterface) {
        private _container: ContainerBuilder;

        __construct(): void;

        constructor();

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        private _processArguments(args: any[], inMethodCall: boolean, inCollection?: boolean): any[];
    }
}
