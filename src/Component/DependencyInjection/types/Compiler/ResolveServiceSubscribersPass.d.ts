declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import Reference = Jymfony.Component.DependencyInjection.Reference;

    /**
     * Compiler pass to inject their service locator to service subscribers.
     */
    export class ResolveServiceSubscribersPass extends AbstractRecursivePass {
        private _serviceLocator?: Reference;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        _processValue(value: any, isRoot?: boolean): any;
    }
}
