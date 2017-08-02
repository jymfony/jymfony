/**
 * @memberOf Jymfony.Component.Config.Loader
 */
class LoaderResolverInterface {
    /**
     * Returns a loader able to load the resource.
     *
     * @param {*} resource A resource
     * @param {undefined|string} type The resource type or null if unknown
     *
     * @returns {Jymfony.Component.Config.Loader.LoaderInterface|false} The loader or false if none is able to load the resource
     */
    resolve(resource, type = undefined) { }
}

module.exports = getInterface(LoaderResolverInterface);
