/**
 * @memberOf Jymfony.Component.Kernel
 */
class KernelInterface {
    /**
     * Gets the name of the kernel.
     *
     * @returns {string} The kernel name
     */
    getName() { }

    /**
     * Gets the environment.
     *
     * @returns {string} The current environment
     */
    get environment() { }

    /**
     * Checks if debug mode is enabled.
     *
     * @returns {boolean} true if debug mode is enabled, false otherwise
     */
    get debug() { }

    /**
     * Gets the current container.
     *
     * @returns {Jymfony.Component.DependencyInjection.Container} A ContainerInterface instance
     */
    get container() { }

    /**
     * Loads the container configuration.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader A LoaderInterface instance
     */
    registerContainerConfiguration(loader) { }

    /**
     * Gets the registered bundle instances.
     *
     * @returns {Jymfony.Component.Kernel.Bundle[]} An array of registered bundle instances
     */
    getBundles() { }

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
    getBundle(name, first = true) { }

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
     * @param {string} name A resource name to locate
     * @param {undefined|string} [dir] A directory where to look for the resource first
     * @param {boolean} [first = true] Whether to return the first path or paths for all matching bundles
     *
     * @returns {string|string[]} The absolute path of the resource or an array if first is false
     *
     * @throws {InvalidArgumentException} if the file cannot be found or the name is not valid
     * @throws {RuntimeException} if the name contains invalid/unsafe characters
     */
    locateResource(name, dir = undefined, first = true) { }
}

export default getInterface(KernelInterface);
