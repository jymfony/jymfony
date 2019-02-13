declare namespace Jymfony.Component.Config.Loader {
    /**
     * DelegatingLoader delegates loading to other loaders using a loader resolver.
     *
     * This loader acts as an array of LoaderInterface objects - each having
     * a chance to load a given resource (handled by the resolver)
     */
    export class DelegatingLoader extends Loader {
        /**
         * Constructor.
         *
         * @param resolver A LoaderResolverInterface instance
         */
        // @ts-ignore
        __construct(resolver: LoaderResolverInterface): void;
        constructor(resolver: LoaderResolverInterface);

        /**
         * @inheritdoc
         */
        load(resource: any, type?: string): any;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;
    }
}
