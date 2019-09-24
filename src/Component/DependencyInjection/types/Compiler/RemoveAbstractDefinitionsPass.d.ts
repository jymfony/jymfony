declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class RemoveAbstractDefinitionsPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
