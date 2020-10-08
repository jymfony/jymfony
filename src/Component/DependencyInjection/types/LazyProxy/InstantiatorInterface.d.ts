declare namespace Jymfony.Component.DependencyInjection.LazyProxy {
    import Container = Jymfony.Component.DependencyInjection.Container;
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    /**
     * Lazy proxy instantiator.
     */
    export class InstantiatorInterface {
        public static readonly definition: Newable<InstantiatorInterface>;

        /**
         * Instantiate a proxy object.
         */
        instantiateProxy(container: Container, definition: Definition, id: string, initializer: Invokable): any;
    }
}
