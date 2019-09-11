/**
 * @memberOf Jymfony.Component.DependencyInjection.Extension
 */
class PrependExtensionInterface {
    /**
     * Allows an extension to prepend the extension configurations.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    prepend(container) { }
}

export default getInterface(PrependExtensionInterface);
