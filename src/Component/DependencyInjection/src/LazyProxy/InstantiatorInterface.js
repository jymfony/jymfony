/**
 * Lazy proxy instantiator.
 *
 * @memberOf Jymfony.Component.DependencyInjection.LazyProxy
 */
class InstantiatorInterface {
    /**
     * Instantiate a proxy object.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     * @param {string} id
     * @param {Function} initializer
     *
     * @returns {*}
     */
    instantiateProxy(container, definition, id, initializer) { }
}

module.exports = getInterface(InstantiatorInterface);
