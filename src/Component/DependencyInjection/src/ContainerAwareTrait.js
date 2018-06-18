/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ContainerAwareTrait {
    /**
     * Sets the container.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    setContainer(container) {
        /**
         * Service container.
         *
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @protected
         */
        this._container = container;
    }
}

module.exports = getTrait(ContainerAwareTrait);
