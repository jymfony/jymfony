declare namespace Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

    /**
     * Find all service tags which are defined, but not used and yield a warning log message.
     */
    export class UnusedTagsPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
