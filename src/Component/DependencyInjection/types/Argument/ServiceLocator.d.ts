declare namespace Jymfony.Component.DependencyInjection.Argument {
    import BaseServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;

    /**
     * @internal
     */
    export class ServiceLocator extends BaseServiceLocator {
        private _factory: Invokable;
        private _serviceMap: Record<string, any>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(factory: Invokable, serviceMap: Record<string, any>): void;
        constructor(factory: Invokable, serviceMap: Record<string, any>);

        /**
         * @inheritdoc
         */
        get(id: string|symbol|Newable<any>): any;
    }
}
