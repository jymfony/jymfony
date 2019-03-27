declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ResolveClassPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
