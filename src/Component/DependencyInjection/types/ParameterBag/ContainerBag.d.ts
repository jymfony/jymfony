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
        get(name: string): any;

        /**
         * @inheritdoc
         */
        has(name: string): boolean;
    }
}
