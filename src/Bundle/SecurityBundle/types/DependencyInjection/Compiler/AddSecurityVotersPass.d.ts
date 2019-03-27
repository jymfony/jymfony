declare namespace Jymfony.SecurityBundle.DependencyInjection.Compiler {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class AddSecurityVotersPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
