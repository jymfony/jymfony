declare namespace Jymfony.Component.Console.DependencyInjection {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class AddConsoleCommandPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
