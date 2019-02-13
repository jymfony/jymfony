declare namespace Jymfony.Component.DependencyInjection.LazyProxy {
    import Container = Jymfony.Component.DependencyInjection.Container;
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    export class RealServiceInstantiator extends implementationOf(InstantiatorInterface) {
        /**
         * @inheritdoc
         */
        instantiateProxy(container: Container, definition: Definition, id: string, initializer: Invokable): any;
    }
}
