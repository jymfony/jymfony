declare namespace Jymfony.Component.DependencyInjection {
    export class ContainerAwareInterface {
        public static readonly definition: Newable<ContainerAwareInterface>;

        /**
         * Sets the container.
         */
        setContainer(container: Container): void;
    }
}
