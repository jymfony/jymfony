declare namespace Jymfony.Component.DependencyInjection {
    import Container = Jymfony.Component.DependencyInjection.Container;
    import ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;

    export class ServiceLocator extends implementationOf(ContainerInterface) {
        private _factories: Record<string, Invokable<any>>;
        private _loading: Record<string, boolean>;
        private _externalId?: string;
        private _container?: Container;

        /**
         * Constructor.
         */
        __construct(factories: Record<string, Invokable<any>>): void;

        /**
         * @inheritdoc
         */
        has(id: string): boolean;

        /**
         * @inheritdoc
         */
        get(id: string|symbol|Newable<any>): any;

        __invoke(id: string): any;

        /**
         * Sets the service locator context.
         *
         * @param {string} externalId
         * @param {Jymfony.Component.DependencyInjection.Container} container
         *
         * @internal
         */
        _withContext(externalId: string, container: Container): ServiceLocator;

        /**
         * Creates a not found exception.
         */
        private _createNotFoundException(id: string): ServiceNotFoundException;

        /**
         * Formats alternatives for this service locator.
         */
        private _formatAlternatives(): string;
    }
}
