declare namespace Jymfony.Component.DependencyInjection {
    export class ContainerAwareTrait {
        public static readonly definition: Newable<ContainerAwareTrait>;

        /**
         * Service container.
         */
        protected _container: Container;

        __construct(): void;
        constructor();

        /**
         * Sets the container.
         */
        setContainer(container: Container): void;
    }
}
