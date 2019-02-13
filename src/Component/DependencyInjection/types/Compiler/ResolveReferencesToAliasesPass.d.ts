declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ResolveReferencesToAliasesPass extends AbstractRecursivePass {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        /**
         * @inheritdoc
         */
        protected _processValue(value: any): any;

        private _getDefinitionId(id: string, container: ContainerBuilder): string;
    }
}
