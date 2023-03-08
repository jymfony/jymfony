declare namespace Jymfony.Bundle.FrameworkBundle.Test {
    import Container = Jymfony.Component.DependencyInjection.Container;
    import ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import ServiceIdentifier = Jymfony.Component.DependencyInjection.ServiceIdentifier;

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
        set(id: ServiceIdentifier, service: any): void;

        /**
         * @inheritdoc
         */
        has(id: ServiceIdentifier): boolean;

        /**
         * @inheritdoc
         */
        get(id: ServiceIdentifier, invalidBehavior?: number): any;

        /**
         * @inheritdoc
         */
        initialized(id: ServiceIdentifier): boolean;

        /**
         * @inheritdoc
         */
        reset(): Promise<void>;
    }
}
