declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class RemovePrivateAliasesPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
