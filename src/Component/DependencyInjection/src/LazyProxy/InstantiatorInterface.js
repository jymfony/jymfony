/**
 * Lazy proxy instantiator
 *
 * @memberOf Jymfony.Component.DependencyInjection.LazyProxy
 * @type {Jymfony.Component.DependencyInjection.LazyProxy.InstantiatorInterface}
 */
class InstantiatorInterface {
    /**
     * Instantiate a proxy object
     *
     * @function
     * @name InstantiatorInterface#instantiateProxy
     *
     * @param {Container} container
     * @param {Definition} definition
     * @param {string} id
     * @param {Function} initializer
     *
     * @returns {*}
     */
}

module.exports = getInterface(InstantiatorInterface);
