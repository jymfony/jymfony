declare namespace Jymfony.Component.DependencyInjection {
    export class ContainerAwareInterface implements MixinInterface {
        public static readonly definition: Newable<ContainerAwareInterface>;

        /**
         * Sets the container.
         */
        setContainer(container: Container): void;
    }
}
