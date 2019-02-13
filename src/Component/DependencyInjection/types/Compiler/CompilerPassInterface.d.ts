declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class CompilerPassInterface implements MixinInterface {
        public static readonly definition: Newable<CompilerPassInterface>;

        /**
         * Modify container.
         */
        process(container: ContainerBuilder): void;
    }
}
