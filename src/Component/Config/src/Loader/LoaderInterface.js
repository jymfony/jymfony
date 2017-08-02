/**
 * @memberOf {Jymfony.Component.Config.Loader}
 */
class LoaderInterface {
    /**
     * Loads a resource.
     *
     * @param {*} resource The resource
     * @param {undefined|string} type The resource type or undefined if unknown
     *
     * @throws {Exception} If something went wrong
     */
    load(resource, type = undefined) { }

    /**
     * Returns whether this class supports the given resource.
     *
     * @param {*} resource A resource
     * @param {undefined|string} type The resource type or undefined if unknown
     *
     * @returns {boolean} True if this class supports the given resource, false otherwise
     */
    supports(resource, type = null) { }

    /**
     * Gets the loader resolver.
     *
     * @returns {Jymfony.Component.Config.Loader.LoaderResolverInterface} A LoaderResolverInterface instance
     */
    get resolver() { }

    /**
     * Sets the loader resolver.
     *
     * @param {Jymfony.Component.Config.Loader.LoaderResolverInterface} resolver A LoaderResolverInterface instance
     */
    set resolver(resolver) { }
}

module.exports = getInterface(LoaderInterface);
