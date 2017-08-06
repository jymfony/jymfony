/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ContainerAwareInterface {
    /**
     * Sets the container
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    setContainer(container) { }
}

module.exports = getInterface(ContainerAwareInterface);
