declare namespace Jymfony.Component.Kernel {
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
    import LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;

    export class KernelInterface {
        /**
         * Gets the name of the kernel.
         *
         * @returns The kernel name
         */
        getName(): string;

        /**
         * Gets the environment.
         *
         * @returns The current environment
         */
        public readonly environment: string;

        /**
         * Checks if debug mode is enabled.
         *
         * @returns true if debug mode is enabled, false otherwise
         */
        public readonly debug: boolean;

        /**
         * Gets the current container.
         *
         * @returns A ContainerInterface instance
         */
        public readonly container: ContainerInterface;

        /**
         * Loads the container configuration.
         *
         * @param loader A LoaderInterface instance
         */
        registerContainerConfiguration(loader: LoaderInterface): void;

        /**
         * Gets the registered bundle instances.
         *
         * @returns An array of registered bundle instances
         */
        getBundles(): Bundle[] | IterableIterator<Bundle>;

        /**
         * Returns a bundle and optionally its descendants by its name.
         *
         * @param {string} name Bundle name
         * @param {boolean} [first = true] Whether to return the first bundle only or together with its descendants
         *
         * @returns {Jymfony.Component.Kernel.Bundle|Jymfony.Component.Kernel.Bundle[]} A BundleInterface instance or an array of BundleInterface instances if first is false
         *
         * @throws {InvalidArgumentException} when the bundle is not enabled
         */
        getBundle(name: string, first?: true): Bundle;
        getBundle(name: string, first?: false): Bundle[];

        /**
         * Returns the file path for a given resource.
         *
         * A Resource can be a file or a directory.
         *
         * The resource name must follow the following pattern:
         *
         *     "@BundleName/path/to/a/file.something"
         *
         * where BundleName is the name of the bundle
         * and the remaining part is the relative path in the bundle.
         *
         * If dir is passed, and the first segment of the path is "Resources",
         * this method will look for a file named:
         *
         *     dir/<BundleName>/path/without/Resources
         *
         * before looking in the bundle resource folder.
         *
         * @param name A resource name to locate
         * @param [dir] A directory where to look for the resource first
         * @param [first = true] Whether to return the first path or paths for all matching bundles
         *
         * @returns The absolute path of the resource or an array if first is false
         *
         * @throws {InvalidArgumentException} if the file cannot be found or the name is not valid
         * @throws {RuntimeException} if the name contains invalid/unsafe characters
         */
        locateResource(name: string, dir?: string | undefined, first?: true): string;
        locateResource(name: string, dir?: string | undefined, first?: false): string[];
    }
}
