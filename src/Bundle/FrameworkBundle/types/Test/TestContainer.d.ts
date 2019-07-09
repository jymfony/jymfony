declare namespace Jymfony.Bundle.FrameworkBundle.Test {
    import Container = Jymfony.Component.DependencyInjection.Container;
    import ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

    export class TestContainer extends Container {
        private _publicContainer: Container;
        private _privateContainer: ContainerInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(parameterBag: ParameterBag, publicContainer: Container, serviceLocator: ContainerInterface): void;
        constructor(parameterBag: ParameterBag, publicContainer: Container, serviceLocator: ContainerInterface);

        /**
         * @inheritdoc
         */
        compile(): void;

        /**
         * @inheritdoc
         */
        public readonly frozen: boolean;

        /**
         * @inheritdoc
         */
        set(id: string | symbol | Function, service: any): void;

        /**
         * @inheritdoc
         */
        get(id: string | symbol | Function, invalidBehavior?: number): any;

        /**
         * @inheritdoc
         */
        initialized(id: string | symbol | Function): boolean;

        /**
         * @inheritdoc
         */
        reset(): Promise<void>;
    }
}
