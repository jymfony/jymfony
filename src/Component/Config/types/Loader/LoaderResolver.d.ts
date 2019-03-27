declare namespace Jymfony.Component.Config.Loader {
    /**
     * LoaderResolver selects a loader for a given resource.
     *
     * A resource can be anything (e.g. a full path to a config file or a Closure).
     * Each loader determines whether it can load a resource and how.
     */
    export class LoaderResolver extends implementationOf(LoaderResolverInterface) {
        public readonly loaders: LoaderInterface[];

        /**
         * Constructor.
         *
         * @param [loaders = []] An array of loaders
         */
        __construct(loaders?: LoaderInterface[]): void;
        constructor(loaders?: LoaderInterface[]);

        /**
         * @inheritdoc
         */
        resolve(resource: any, type?: string): LoaderInterface|false;

        /**
         * Adds a loader.
         *
         * @param loader A LoaderInterface instance
         */
        addLoader(loader: LoaderInterface): void;
    }
}
