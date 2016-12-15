/**
 * Lazy proxy instantiator
 *
 * @memberOf Jymfony.DependencyInjection.LazyProxy
 * @type {Jymfony.DependencyInjection.LazyProxy.InstantiatorInterface}
 */
module.exports = getInterface(class InstantiatorInterface {
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
});
