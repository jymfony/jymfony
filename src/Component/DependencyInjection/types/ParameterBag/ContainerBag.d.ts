declare namespace Jymfony.Component.DependencyInjection.ParameterBag {
    import Container = Jymfony.Component.DependencyInjection.Container;

    export class ContainerBag extends mix(FrozenParameterBag, ContainerBagInterface) {
        private _container: Container;

        /**
         * Constructor.
         */
        __construct(container: Container): void;
        constructor(container: Container);

        /**
         * @inheritdoc
         */
        all(): Record<string, any>;

        /**
         * @inheritdoc
         */
        get<T extends object>(id: Newable<T> | symbol): never;
        get<T = any>(name: string): T;

        /**
         * @inheritdoc
         */
        has(name: string): boolean;
    }
}
