declare namespace Jymfony.Component.DependencyInjection.Loader {
    import Loader = Jymfony.Component.Config.Loader.Loader;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * JsFileLoader loads service definitions from a js function.
     */
    export class FunctionLoader extends Loader {
        private _container: ContainerBuilder;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(container: ContainerBuilder, env?: string | null): void;
        constructor(container: ContainerBuilder, env?: string | null);

        /**
         * @inheritdoc
         */
        load(resource: Invokable<void>, type?: string): any;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;
    }
}
