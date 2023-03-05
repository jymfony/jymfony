declare namespace Jymfony.Component.Logger.DependencyInjection.Compiler {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class LoggerAddProcessorsPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
