declare namespace Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class AddDebugLogProcessorPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
