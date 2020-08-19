declare namespace Jymfony.Component.Config.Loader {
    export class LoaderResolverInterface {
        public static readonly definition: Newable<LoaderResolverInterface>;

        /**
         * Returns a loader able to load the resource.
         *
         * @returns The loader or false if none is able to load the resource
         */
        resolve(resource: any, type?: string): LoaderInterface|false;
    }
}
