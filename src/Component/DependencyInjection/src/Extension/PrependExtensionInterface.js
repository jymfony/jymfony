/**
 * @memberOf Jymfony.Component.DependencyInjection.Extension
 */
class PrependExtensionInterface {
    /**
     * Allow an extension to prepend the extension configurations
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    prepend(container) { }
}

module.exports = getInterface(PrependExtensionInterface);
