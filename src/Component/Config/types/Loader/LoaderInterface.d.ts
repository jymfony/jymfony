declare namespace Jymfony.Component.Config.Loader {
    export class LoaderInterface {
        /**
         * The loader resolver
         */
        public resolver: LoaderResolverInterface;

        /**
         * Loads a resource.
         *
         * @throws {Exception} If something went wrong
         */
        load(resource: any, type?: string): any;

        /**
         * Returns whether this class supports the given resource.
         *
         * @returns True if this class supports the given resource, false otherwise
         */
        supports(resource: any, type?: string): boolean;
    }
}
