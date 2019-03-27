declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ExtensionCompilerPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
